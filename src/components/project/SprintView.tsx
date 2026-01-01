import { Projeto, Sprint, Iniciativa } from "@/lib/types";
import { LeanCanvasView } from "./LeanCanvasView";
import { InitiativeKanban } from "./InitiativeKanban";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SprintViewProps {
  projeto: Projeto;
  sprint: Sprint;
  onIniciativaClick: (iniciativa: Iniciativa) => void;
}

export function SprintView({ projeto, sprint, onIniciativaClick }: SprintViewProps) {
  // Filtra iniciativas da sprint atual
  const iniciativasDaSprint = projeto.iniciativas?.filter(
    (i) => i.sprint_id === sprint.id
  ) || [];

  const startDate = parseISO(sprint.data_inicio);
  const endDate = parseISO(sprint.data_fim);

  return (
    <div className="space-y-6">
      {/* Informações da Sprint */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <PlayCircle className="h-5 w-5 text-primary" />
              {sprint.nome}
            </CardTitle>
            <Badge variant="default">Sprint Ativa</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {format(startDate, "dd 'de' MMMM", { locale: ptBR })} a{" "}
              {format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Lean Canvas */}
      {projeto.lean_canvas ? (
        <LeanCanvasView canvas={projeto.lean_canvas} />
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Lean Canvas não disponível para este projeto.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Kanban da Sprint */}
      <InitiativeKanban
        iniciativas={iniciativasDaSprint}
        onIniciativaClick={onIniciativaClick}
        title="Kanban da Sprint"
      />
    </div>
  );
}
