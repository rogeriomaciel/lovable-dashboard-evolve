import { Iniciativa } from "@/lib/types";
import { InitiativeCard } from "@/components/InitiativeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Kanban } from "lucide-react";

interface InitiativeKanbanProps {
  iniciativas: Iniciativa[];
  onIniciativaClick: (iniciativa: Iniciativa) => void;
  title?: string;
}

const STATUS_COLUMNS = ["A Fazer", "Em Andamento", "Concluído"] as const;

export function InitiativeKanban({
  iniciativas,
  onIniciativaClick,
  title = "Quadro Kanban",
}: InitiativeKanbanProps) {
  const iniciativasPorStatus = {
    "A Fazer": iniciativas.filter((i) => i.status === "A Fazer"),
    "Em Andamento": iniciativas.filter((i) => i.status === "Em Andamento"),
    "Concluído": iniciativas.filter((i) => i.status === "Concluído"),
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Kanban className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          {STATUS_COLUMNS.map((status) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <h3 className="font-semibold text-sm">{status}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {iniciativasPorStatus[status].length}
                </span>
              </div>
              <div className="space-y-3 min-h-[100px]">
                {iniciativasPorStatus[status].map((iniciativa) => (
                  <InitiativeCard
                    key={iniciativa.id}
                    iniciativa={iniciativa}
                    onClick={() => onIniciativaClick(iniciativa)}
                  />
                ))}
                {iniciativasPorStatus[status].length === 0 && (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    Nenhuma iniciativa
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
