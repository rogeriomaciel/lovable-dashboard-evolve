import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Projeto } from "@/lib/types";
import { CheckCircle2, Target } from "lucide-react";

interface ProjectCardProps {
  projeto: Projeto;
}

export function ProjectCard({ projeto }: ProjectCardProps) {
  // Cast para any para garantir acesso às propriedades que podem vir como string ou novas
  const p = projeto as any;
  const sprintsConcluidas = Number(p.sprints_concluidas) || 0;
  const iniciativasAtivas = Number(p.iniciativas_ativas) || 0;
  const progresso = Number(p.percentual_conclusao_projeto) || 0;

  return (
    <Link to={`/projeto/${p.projeto_id || projeto.id}`}>
      <Card className="group transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="group-hover:text-primary transition-colors">
              {projeto.nome_projeto}
            </span>
            <Target className="h-5 w-5 text-primary" />
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {projeto.descricao || p.proposito}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {sprintsConcluidas} Sprints Concluídas
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {iniciativasAtivas} Iniciativas Ativas
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progresso Geral</span>
              <span className="font-medium">{Math.round(progresso)}%</span>
            </div>
            <Progress value={progresso} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
