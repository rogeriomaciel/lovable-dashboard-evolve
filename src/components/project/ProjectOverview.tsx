import { Projeto, Iniciativa } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InitiativeKanban } from "./InitiativeKanban";
import { SprintTimeline } from "./SprintTimeline";
import { Info } from "lucide-react";

interface ProjectOverviewProps {
  projeto: Projeto;
  onIniciativaClick: (iniciativa: Iniciativa) => void;
}

export function ProjectOverview({ projeto, onIniciativaClick }: ProjectOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Informações Gerais */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-primary" />
            Informações do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Sprints Concluídas</p>
              <p className="text-2xl font-bold text-primary">
                {projeto.sprints_concluidas ?? projeto.sprints?.filter(s => s.status === "concluida").length ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Iniciativas Ativas</p>
              <p className="text-2xl font-bold text-primary">
                {projeto.iniciativas_ativas ?? projeto.iniciativas?.filter(i => i.status === "Em Andamento").length ?? 0}
              </p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">Total de Iniciativas</p>
              <p className="text-2xl font-bold text-primary">
                {projeto.iniciativas?.length ?? 0}
              </p>
            </div>
          </div>
          {projeto.descricao && (
            <p className="mt-4 text-sm text-muted-foreground">
              {projeto.descricao}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Kanban de Iniciativas */}
      <InitiativeKanban
        iniciativas={projeto.iniciativas || []}
        onIniciativaClick={onIniciativaClick}
        title="Kanban de Iniciativas"
      />

      {/* Timeline de Sprints */}
      <SprintTimeline sprints={projeto.sprints || []} />
    </div>
  );
}
