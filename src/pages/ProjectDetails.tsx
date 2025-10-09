import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Projeto, Iniciativa } from "@/lib/types";
import { Header } from "@/components/Header";
import { SprintCard } from "@/components/SprintCard";
import { InitiativeCard } from "@/components/InitiativeCard";
import { InitiativeDetailsModal } from "@/components/InitiativeDetailsModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, PartyPopper } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [selectedIniciativa, setSelectedIniciativa] = useState<Iniciativa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const sprintsAnteriores = projeto.sprints?.filter((s) => s.status === "concluida") || [];
  
  const iniciativasPorStatus = {
    "A Fazer": projeto.iniciativas?.filter((i) => i.status === "A Fazer") || [],
    "Em Andamento": projeto.iniciativas?.filter((i) => i.status === "Em Andamento") || [],
    "Concluído": projeto.iniciativas?.filter((i) => i.status === "Concluído") || [],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
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

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{projeto.nome_projeto}</h1>
          <p className="text-muted-foreground">{projeto.descricao}</p>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Sprints</h2>
          <div className="space-y-4">
            {sprintAtiva && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Sprint Ativa
                </h3>
                <SprintCard sprint={sprintAtiva} isActive />
              </div>
            )}
            {sprintsAnteriores.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Sprints Anteriores
                </h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {sprintsAnteriores.map((sprint) => (
                    <SprintCard key={sprint.id} sprint={sprint} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Quadro Kanban</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {Object.entries(iniciativasPorStatus).map(([status, iniciativas]) => (
              <div key={status} className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-card p-3">
                  <h3 className="font-semibold">{status}</h3>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {iniciativas.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {iniciativas.map((iniciativa) => (
                    <InitiativeCard
                      key={iniciativa.id}
                      iniciativa={iniciativa}
                      onClick={() => setSelectedIniciativa(iniciativa)}
                    />
                  ))}
                  {iniciativas.length === 0 && (
                    <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                      Nenhuma iniciativa
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
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
