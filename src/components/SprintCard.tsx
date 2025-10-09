import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprint } from "@/lib/types";
import { Calendar, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SprintCardProps {
  sprint: Sprint;
  isActive?: boolean;
}

export function SprintCard({ sprint, isActive }: SprintCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM yyyy", { locale: ptBR });
  };

  return (
    <Card className={isActive ? "border-primary shadow-lg shadow-primary/10" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">{sprint.nome}</span>
          {isActive ? (
            <Badge className="bg-primary">Ativa</Badge>
          ) : (
            <Badge variant="secondary">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Concluída
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDate(sprint.data_inicio)} - {formatDate(sprint.data_fim)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
