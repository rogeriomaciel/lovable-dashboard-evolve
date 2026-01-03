import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankingItem } from "@/lib/types";
import { Trophy, Medal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProjectRankingViewProps {
  ranking: RankingItem[];
}

export function ProjectRankingView({ ranking }: ProjectRankingViewProps) {
  if (!ranking || ranking.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Nenhum dado de ranking disponível para este projeto.
        </CardContent>
      </Card>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="h-5 w-5 text-primary" />
          Ranking do Projeto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ranking.map((item, index) => (
            <div
              key={item.usuario_id}
              className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index)}
              </div>
              
              <Avatar className="h-10 w-10 border-2 border-muted">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(item.nome_usuario)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.nome_usuario}</p>
                <p className="text-xs text-muted-foreground">
                  {item.status_no_projeto} • {item.total_interacoes} interações
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-primary">{item.xp_no_projeto} XP</p>
                <p className="text-xs text-muted-foreground">
                  Última: {formatDistanceToNow(new Date(item.ultima_interacao), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}