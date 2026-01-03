import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { SprintDashboardData, Iniciativa } from "@/lib/types";
import { Header } from "@/components/Header";
import { InitiativeKanban } from "@/components/project/InitiativeKanban";
import { InitiativeDetailsModal } from "@/components/InitiativeDetailsModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Target, Clock, Activity, AlertTriangle, Lock } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function SprintDashboard() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SprintDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIniciativa, setSelectedIniciativa] = useState<Iniciativa | null>(null);

  useEffect(() => {
    async function loadSprint() {
      if (!id) return;
      try {
        const sprintData = await api.getSprintDashboard(id);
        setData(sprintData);
      } catch (error: any) {
        toast({
          title: "Erro ao carregar sprint",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadSprint();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8 space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96 w-full" />
        </main>
      </div>
    );
  }

  if (!data) return null;

  const isSprintActive = data.status.toLowerCase() === 'ativa';
  const timeProgress = Number(data.percentual_tempo_decorrido);
  const taskProgress = Number(data.progresso_geral_sprint);
  
  // Lógica de cor do cronômetro
  let timerColor = "text-primary";
  let timerBarColor = "bg-primary";
  
  if (taskProgress > timeProgress) {
    timerColor = "text-green-500";
    timerBarColor = "bg-green-500";
  } else if (timeProgress > 80 && taskProgress < 20) {
    timerColor = "text-destructive";
    timerBarColor = "bg-destructive";
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 space-y-8">
        {/* Navegação */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        {/* Header Tático */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-3 items-center">
              {/* Esquerda: Info */}
              <div className="md:col-span-2 space-y-1">
                <h3>Sprint</h3>
                <h2 className="text-2xl font-bold">{data.nome_sprint}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(parseISO(data.data_inicio), "dd/MM", { locale: ptBR })} -{" "}
                    {format(parseISO(data.data_fim), "dd/MM", { locale: ptBR })}
                  </span>
                </div>
              </div>

              {/* Direita: Cronômetro */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted-foreground">Tempo Restante</span>
                  <span className={`text-2xl font-bold ${timerColor}`}>
                    {data.dias_restantes} dias
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Tempo: {Math.round(timeProgress)}%</span>
                    <span>Iniciativas: {Math.round(taskProgress)}%</span>
                  </div>
                  <Progress value={timeProgress} className="h-2" indicatorClassName={timerBarColor} />
                </div>
              </div>
            </div>
            {/* Objetivo Principal - Full Width */}
            <div className="mt-6 border-t pt-4 ">
              <div className="flex   gap-2 text-primary font-semibold uppercase tracking-wide text-xs">
                <Target className="h-4 w-4" />
                Objetivo Principal da Rodada
              </div>
              <p className="mt-2 text-2xl font-medium ">
                "{data.objetivo_principal}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Corpo: Pulso e Crise */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna da Esquerda: O Pulso (2/3) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                O Pulso da Sprint (XP Diário)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.grafico_atividade}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="data" 
                      tickFormatter={(val) => format(parseISO(val), "dd/MM")}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      labelFormatter={(val) => format(parseISO(val), "dd 'de' MMMM", { locale: ptBR })}
                    />
                    <Bar dataKey="xp_gerado" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="XP Gerado" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Coluna da Direita: Sala de Crise (1/3) */}
          <Card className="lg:col-span-1 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Sala de Crise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.alertas_impedimentos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <p>Nenhum impedimento crítico.</p>
                  <p className="text-sm">O time está fluindo!</p>
                </div>
              ) : (
                data.alertas_impedimentos.map((alerta) => {
                  const iniciativaCompleta = data.iniciativas_da_sprint.find(
                    (i) => String(i.id) === String(alerta.id)
                  );

                  return (
                    <div
                      key={alerta.id}
                      className="p-3 rounded-lg bg-background border border-destructive/30 shadow-sm cursor-pointer hover:bg-destructive/10 transition-colors"
                      onClick={() => {
                        if (iniciativaCompleta) {
                          setSelectedIniciativa(iniciativaCompleta);
                        } else {
                          toast({
                            title: "Iniciativa não encontrada",
                            description: `Não foi possível carregar os detalhes da iniciativa #${alerta.id}.`,
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <p className="font-medium text-destructive text-sm mb-1">🚨 Impedimento Detectado</p>
                      <p className="text-sm">Iniciativa: {alerta.iniciativa_nome}</p>
                      <p className="text-xs">{alerta.texto_blocker}</p>
                      <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                        <span>{alerta.responsavel}</span>
                        <span>{format(parseISO(alerta.data_reporte), "dd/MM - HH:mm")}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Rodapé: A Execução */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Execução Tática</h2>
          <InitiativeKanban 
            iniciativas={data.iniciativas_da_sprint} 
            onIniciativaClick={setSelectedIniciativa}
            columns={["A Fazer", "Em Andamento", "Concluído"]}
            title="Quadro da Sprint"
          />
        </div>
      </main>

      <InitiativeDetailsModal
        iniciativa={selectedIniciativa}
        open={!!selectedIniciativa}
        onOpenChange={(open) => !open && setSelectedIniciativa(null)}
      />
    </div>
  );
}