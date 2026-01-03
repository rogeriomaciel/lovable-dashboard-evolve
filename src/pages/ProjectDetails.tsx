import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Projeto, Iniciativa, RankingItem } from "@/lib/types";
import { Header } from "@/components/Header";
import { InitiativeDetailsModal } from "@/components/InitiativeDetailsModal";
import { ProjectOverview } from "@/components/project/ProjectOverview";
import { GamificationView } from "@/components/project/GamificationView";
import { ProjectRankingView } from "@/components/project/ProjectRankingView";
import { SprintView } from "@/components/project/SprintView";
import { StrategicView } from "@/components/project/StrategicView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, PartyPopper, LayoutGrid, PlayCircle, Target, Gamepad2, Trophy } from "lucide-react";

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [selectedIniciativa, setSelectedIniciativa] = useState<Iniciativa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
    

  const loadProjeto = async () => {
    if (!id) return;
    try {
      // Carrega projeto e ranking em paralelo
      const [data, rankingData] = await Promise.all([
        api.getProjeto(id),
        api.getProjectRanking(id).catch(() => []) // Falha silenciosa para o ranking não quebrar a página
      ]);
      
      setRanking(rankingData);

      const rawData = Array.isArray(data) ? (data as any)[0] : data;

      if (rawData) {
        // Adapta a nova estrutura da API para a estrutura esperada pelo frontend
        const transformedProjeto = {
          ...rawData,
          id: rawData.projeto_id || rawData.id, // Mapeia projeto_id para id
          sprints: rawData.timeline_sprints || rawData.sprints || [], // Mapeia a nova timeline de sprints
          sprints_concluidas: Number(rawData.sprints_concluidas) || 0,
          iniciativas_ativas: Number(rawData.iniciativas_ativas) || 0,
          iniciativas: (rawData.lista_iniciativas || rawData.iniciativas || []).map((i: any) => {
            let checklistItems = [];

            if (Array.isArray(i.checklist)) {
              // Novo formato da API: Array direto com { texto, feito }
              checklistItems = i.checklist.map((item: any) => ({
                id: item.id,
                text: item.texto,
                status: item.feito ? "completed" : "pending"
              }));
            } else if (i.checklist?.items) {
              checklistItems = i.checklist.items;
            } else if (i.checklist_data?.items) {
              checklistItems = i.checklist_data.items;
            }

            return {
              ...i,
              iniciativa_nome: i.nome || i.iniciativa_nome, // Garante que o nome apareça corretamente nos cards
              checklist_data: { items: checklistItems }
            };
          }),
        };
        setProjeto(transformedProjeto as Projeto);
      }
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

  useEffect(() => {
    if (projeto) {
      document.title = `${projeto.nome_projeto} | CORE`;
    } else {
      document.title = "Carregando Projeto... | CORE";
    }
  }, [projeto]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header  />
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
        <Header  />
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
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{projeto.nome_projeto}</h1>
            {projeto.descricao && <p className="text-lg text-muted-foreground mt-2">{projeto.descricao}</p>}
          </div>

          {(projeto as any).proposito && (
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
              <h3 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Propósito Maior
              </h3>
              <p className="text-sm text-foreground">{(projeto as any).proposito}</p>
            </div>
          )}
        </div>

        {/* Tabs de Visualização */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="gamification" className="gap-2">
              <Gamepad2 className="h-4 w-4" />
              Gamificação
            </TabsTrigger>
            <TabsTrigger value="ranking" className="gap-2">
              <Trophy className="h-4 w-4" />
              Ranking
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-2">
              <Target className="h-4 w-4" />
              Estratégia
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

          <TabsContent value="gamification" className="mt-0">
            <GamificationView data={(projeto as any).gamification_config} />
          </TabsContent>

          <TabsContent value="ranking" className="mt-0">
            <ProjectRankingView ranking={ranking} />
          </TabsContent>

          <TabsContent value="strategy" className="mt-0">
            <StrategicView data={(projeto as any).pagina_estrategica} />
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
      />
    </div>
  );
}
