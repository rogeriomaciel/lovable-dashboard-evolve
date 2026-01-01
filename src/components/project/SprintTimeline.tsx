import { Sprint } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, PlayCircle, ThumbsUp, AlertTriangle, Lightbulb } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SprintTimelineProps {
  sprints: Sprint[];
}

function SprintNode({ sprint, isActive }: { sprint: Sprint; isActive: boolean }) {
  const startDate = parseISO(sprint.data_inicio);
  const endDate = parseISO(sprint.data_fim);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`
            relative flex flex-col items-center cursor-pointer
            ${isActive ? "z-10" : ""}
          `}
        >
          {/* Node círculo */}
          <div
            className={`
              w-12 h-12 rounded-full flex items-center justify-center
              transition-all duration-200 hover:scale-110
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }
            `}
          >
            {isActive ? (
              <PlayCircle className="h-6 w-6" />
            ) : (
              <CheckCircle2 className="h-5 w-5" />
            )}
          </div>

          {/* Nome e datas */}
          <div className="mt-2 text-center min-w-[100px]">
            <p
              className={`text-sm font-medium ${
                isActive ? "text-primary" : "text-foreground"
              }`}
            >
              {sprint.nome}
            </p>
            <p className="text-xs text-muted-foreground">
              {format(startDate, "dd/MM", { locale: ptBR })} -{" "}
              {format(endDate, "dd/MM", { locale: ptBR })}
            </p>
          </div>

          {/* Badge de status */}
          {isActive && (
            <Badge className="mt-1" variant="default">
              Ativa
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <div className="space-y-2">
          <p className="font-semibold">{sprint.nome}</p>
          <p className="text-xs text-muted-foreground">
            {format(startDate, "dd 'de' MMMM", { locale: ptBR })} a{" "}
            {format(endDate, "dd 'de' MMMM", { locale: ptBR })}
          </p>
          
          {sprint.resumo_evolucao && (
            <div className="space-y-1.5 pt-2 border-t">
              {sprint.resumo_evolucao.positivos?.length > 0 && (
                <div className="flex items-start gap-2">
                  <ThumbsUp className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-xs">{sprint.resumo_evolucao.positivos[0]}</span>
                </div>
              )}
              {sprint.resumo_evolucao.desafios?.length > 0 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                  <span className="text-xs">{sprint.resumo_evolucao.desafios[0]}</span>
                </div>
              )}
              {sprint.resumo_evolucao.licoes?.length > 0 && (
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-xs">{sprint.resumo_evolucao.licoes[0]}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export function SprintTimeline({ sprints }: SprintTimelineProps) {
  if (!sprints || sprints.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Timeline de Sprints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhuma sprint registrada ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ordena sprints por data de início
  const sortedSprints = [...sprints].sort(
    (a, b) => parseISO(a.data_inicio).getTime() - parseISO(b.data_inicio).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Timeline de Sprints
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="relative flex items-start gap-8 pb-4 px-4">
            {/* Linha conectora */}
            <div className="absolute top-6 left-10 right-10 h-0.5 bg-border" />

            {sortedSprints.map((sprint) => (
              <SprintNode
                key={sprint.id}
                sprint={sprint}
                isActive={sprint.status === "ativa"}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
