import { Iniciativa } from "@/lib/types";
import { InitiativeCard } from "@/components/InitiativeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Kanban } from "lucide-react";

interface InitiativeKanbanProps {
  iniciativas: Iniciativa[];
  onIniciativaClick: (iniciativa: Iniciativa) => void;
  title?: string;
  columns?: string[];
}

const DEFAULT_COLUMNS = ["Backlog", "A Fazer", "Em Andamento", "Concluído"];

export function InitiativeKanban({
  iniciativas,
  onIniciativaClick,
  title = "Quadro Kanban",
  columns = DEFAULT_COLUMNS,
}: InitiativeKanbanProps) {
  
  // Função para normalizar o status e garantir que caia na coluna certa
  const getColumnForStatus = (status: string | undefined): (typeof DEFAULT_COLUMNS)[number] => {
    if (!status) return "Backlog";
    const s = status.toLowerCase().trim();
    
    if (s === "a fazer" || s === "to do" || s === "todo" || s === "pendente") return "A Fazer";
    if (s === "em andamento" || s === "doing" || s === "in progress" || s === "executando") return "Em Andamento";
    if (s === "concluído" || s === "concluido" || s === "done" || s === "finalizado" || s === "entregue") return "Concluído";
    
    return "Backlog";
  };

  const iniciativasPorStatus: Record<string, Iniciativa[]> = {};
  
  columns.forEach(col => {
    iniciativasPorStatus[col] = iniciativas.filter((i) => getColumnForStatus(i.status) === col);
  });
  // Fallback para itens que não se encaixam nas colunas visíveis (opcional, mas seguro)
  // Se a coluna Backlog não estiver visível, itens de backlog não aparecerão.

  const gridColsClass = columns.length === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Kanban className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 md:grid-cols-2 ${gridColsClass}`}>
          {columns.map((status) => (
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
