import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { Projeto } from "@/lib/types";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, PartyPopper, TrendingUp, AlertCircle, BookOpen, CheckCircle2 } from "lucide-react";

export default function Celebration() {
  const { id } = useParams<{ id: string }>();
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjeto() {
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
    }

    loadProjeto();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Skeleton className="mb-8 h-20 w-full" />
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const sprintAtiva = projeto?.sprints?.find((s) => s.status === "ativa");
  const iniciativasConcluidas =
    projeto?.iniciativas?.filter((i) => i.status === "Concluído").length || 0;
  const totalIniciativas = projeto?.iniciativas?.length || 0;
  const progressoPercentual =
    totalIniciativas > 0 ? Math.round((iniciativasConcluidas / totalIniciativas) * 100) : 0;

  const resumo = sprintAtiva?.resumo_evolucao || {
    positivos: ["Ótimo trabalho em equipe", "Entregas dentro do prazo"],
    desafios: ["Comunicação pode melhorar", "Algumas dependências externas"],
    licoes: ["Planejar com mais antecedência", "Documentar decisões importantes"],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Link to={`/projeto/${id}`}>
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o Projeto
          </Button>
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <PartyPopper className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-4xl font-bold">
            Celebração da Sprint: {sprintAtiva?.nome || "Sprint Atual"}
          </h1>
          <p className="text-lg text-muted-foreground">
            Vamos celebrar os resultados e aprendizados desta jornada!
          </p>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-success" />
                Iniciativas Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{iniciativasConcluidas}</p>
              <p className="text-sm text-muted-foreground">
                de {totalIniciativas} totais
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{progressoPercentual}%</p>
              <p className="text-sm text-muted-foreground">
                do projeto completo
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PartyPopper className="h-5 w-5 text-warning" />
                Sprints Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">
                sprint em andamento
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-success" />
                Pontos Positivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resumo.positivos.map((ponto, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1 shrink-0 border-success/50 bg-success/10 text-success">
                      ✓
                    </Badge>
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="h-6 w-6 text-warning" />
                Custos Ocultos (Desafios)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resumo.desafios.map((desafio, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1 shrink-0 border-warning/50 bg-warning/10 text-warning">
                      !
                    </Badge>
                    <span>{desafio}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="h-6 w-6 text-primary" />
                Lições Aprendidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {resumo.licoes.map((licao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1 shrink-0 border-primary/50 bg-primary/10 text-primary">
                      →
                    </Badge>
                    <span>{licao}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
