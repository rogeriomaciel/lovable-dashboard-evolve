import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Projeto, Iniciativa } from "@/lib/types";
import { Header } from "@/components/Header";
import { InitiativeDetailsModal } from "@/components/InitiativeDetailsModal";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { SprintView } from "@/components/project/SprintView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, PartyPopper, LayoutGrid, PlayCircle } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [selectedIniciativa, setSelectedIniciativa] = useState<Iniciativa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const loadProjeto = async () => {
    if (!id) return;
    try {
      const data = await api.getProjeto(id);
      setProjeto(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjeto();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="mb-6 h-12 w-64" />
          <Skeleton className="mb-8 h-20 w-full" />
          <div className="grid gap-6 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-xl text-muted-foreground">Projeto não encontrado</p>
              <Link to="/">
                <Button className="mt-4" variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const sprintAtiva = projeto.sprints?.find((s) => s.status === "ativa");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Navegação */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          {sprintAtiva && (
            <Link to={`/projeto/${projeto.id}/celebracao`}>
              <Button variant="outline" size="sm">
                <PartyPopper className="mr-2 h-4 w-4" />
                Ver Celebração
              </Button>
            </Link>
          )}
        </div>

        {/* Título do Projeto */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{projeto.nome_projeto}</h1>
        </div>

        {/* Tabs de Visualização */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            {sprintAtiva && (
              <TabsTrigger value="sprint" className="gap-2">
                <PlayCircle className="h-4 w-4" />
                Sprint Atual
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <ProjectOverview
              projeto={projeto}
              onIniciativaClick={setSelectedIniciativa}
            />
          </TabsContent>

          {sprintAtiva && (
            <TabsContent value="sprint" className="mt-0">
              <SprintView
                projeto={projeto}
                sprint={sprintAtiva}
                onIniciativaClick={setSelectedIniciativa}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <InitiativeDetailsModal
        iniciativa={selectedIniciativa}
        open={!!selectedIniciativa}
        onOpenChange={(open) => !open && setSelectedIniciativa(null)}
        onUpdate={loadProjeto}
      />
    </div>
  );
}
