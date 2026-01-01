import { useState } from "react";
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
import { Iniciativa, ChecklistItem } from "@/lib/types";
import { CheckCircle2, Circle, Save } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface InitiativeDetailsModalProps {
  iniciativa: Iniciativa | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function InitiativeDetailsModal({
  iniciativa,
  open,
  onOpenChange,
  onUpdate,
}: InitiativeDetailsModalProps) {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useState(() => {
    if (iniciativa?.checklist_data?.items) {
      setItems(iniciativa.checklist_data.items);
    }
  });

  if (!iniciativa) return null;

  const checklist = items.length > 0 ? items : iniciativa.checklist_data?.items || [];
  const completedCount = checklist.filter((item) => item.status === "completed").length;
  const pendingCount = checklist.length - completedCount;
  const progress = checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0;

  const chartData = [
    { name: "Concluídos", value: completedCount, color: "hsl(var(--success))" },
    { name: "Pendentes", value: pendingCount, color: "hsl(var(--muted))" },
  ];

  const handleToggleItem = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status: item.status === "completed" ? "pending" : "completed" }
          : item
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateIniciativaChecklist(iniciativa.id, { items });
      toast({
        title: "Checklist atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{iniciativa.iniciativa_nome}</DialogTitle>
          <DialogDescription>
            {iniciativa.descricao || "Gerencie o checklist desta iniciativa"}
          </DialogDescription>
        </DialogHeader>

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
                      onCheckedChange={() => handleToggleItem(item.id)}
                      className="mt-1"
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

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Salvando..." : "Salvar Alterações"}
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
