import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Iniciativa } from "@/lib/types";
import {
  CheckCircle2,
  Circle,
  Target,
  History,
  MessageSquare,
  ShieldAlert,
  Lightbulb,
  CheckSquare,
  Rocket,
  FlagOff,
  Trophy,
  Undo2,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface InitiativeDetailsModalProps {
  iniciativa: Iniciativa | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getUpdateIcon = (type: string) => {
  switch (type) {
    case "LOG":
      return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
    case "BLOCKER":
      return <ShieldAlert className="h-4 w-4 text-destructive" />;
    case "INSIGHT":
      return <Lightbulb className="h-4 w-4 text-blue-500" />;
    case "CHECKLIST":
      return <CheckSquare className="h-4 w-4 text-primary" />;
    case "INICIO_FOCO":
      return <Rocket className="h-4 w-4 text-green-500" />;
    case "SOLTAR_FOCO":
      return <FlagOff className="h-4 w-4 text-muted-foreground" />;
    case "VITORIA":
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case "ABANDONO":
      return <Undo2 className="h-4 w-4 text-orange-500" />;
    default:
      return <History className="h-4 w-4 text-muted-foreground" />;
  }
};

export function InitiativeDetailsModal({
  iniciativa,
  open,
  onOpenChange,
}: InitiativeDetailsModalProps) {
  if (!iniciativa) return null;

  const historico = (iniciativa as any).historico_updates || [];
  const checklist = iniciativa.checklist_data?.items || [];
  const completedCount = checklist.filter((item) => item.status === "completed").length;
  const pendingCount = checklist.length - completedCount;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  const chartData = [
    { name: "Concluídos", value: completedCount, color: "hsl(var(--success))" },
    { name: "Pendentes", value: pendingCount, color: "hsl(var(--muted))" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{iniciativa.iniciativa_nome}</DialogTitle>
          <DialogDescription>
            {iniciativa.descricao || "Checklist desta iniciativa"}
          </DialogDescription>
        </DialogHeader>

        {(iniciativa as any).proposito && (
          <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
            <h4 className="text-sm font-semibold text-primary mb-1 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Propósito
            </h4>
            <p className="text-sm text-foreground">{(iniciativa as any).proposito}</p>
          </div>
        )}

        {checklist.length > 0 ? (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Progresso Geral</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {completedCount} de {checklist.length} concluídos
                    </span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-medium">Distribuição</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Itens do Checklist</h3>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
                  >
                    <Checkbox
                      id={item.id}
                      checked={item.status === "completed"}
                      className="mt-1"
                      disabled
                    />
                    <label
                      htmlFor={item.id}
                      className="flex-1 cursor-pointer text-sm leading-relaxed"
                    >
                      <span
                        className={
                          item.status === "completed"
                            ? "text-muted-foreground line-through"
                            : ""
                        }
                      >
                        {item.text}
                      </span>
                    </label>
                    {item.status === "completed" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {historico.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Histórico de Atualizações</h3>
                <ScrollArea className="h-[200px] rounded-md border p-3">
                  <div className="space-y-4">
                    {historico.map((update: any) => (
                      <div key={update.id} className="flex items-start gap-3">
                        <div className="mt-1">{getUpdateIcon(update.tipo)}</div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{update.texto}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {update.usuario_nome} •{" "}
                            {formatDistanceToNow(new Date(update.data), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Esta iniciativa não possui itens no checklist.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
