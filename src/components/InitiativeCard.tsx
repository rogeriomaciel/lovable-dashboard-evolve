import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Iniciativa } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";

interface InitiativeCardProps {
  iniciativa: Iniciativa;
  onClick: () => void;
}

export function InitiativeCard({ iniciativa, onClick }: InitiativeCardProps) {
  const checklist = iniciativa.checklist_data?.items || [];
  const completedItems = checklist.filter((item) => item.status === "completed").length;
  const totalItems = checklist.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <Card
      className="group cursor-pointer transition-all hover:border-primary hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-start justify-between text-base">
          <span className="group-hover:text-primary transition-colors">
            {iniciativa.nome}
          </span>
          {totalItems > 0 && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {completedItems}/{totalItems}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {totalItems > 0 && (
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso do Checklist</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" />
              <span>{completedItems} concluídos</span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="h-3 w-3" />
              <span>{totalItems - completedItems} pendentes</span>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
