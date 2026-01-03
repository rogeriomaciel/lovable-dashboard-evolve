import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy } from "lucide-react";

interface GamificationViewProps {
  data: any;
}

export function GamificationView({ data }: GamificationViewProps) {
  if (!data || !data.update_types) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center text-muted-foreground">
          Nenhuma configuração de gamificação definida para este projeto.
        </CardContent>
      </Card>
    );
  }

  const { update_types, conclusion_multiplier } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            Pontos por Tipo de Update (XP)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {Object.entries(update_types).map(([key, value]: [string, any]) => (
            <div key={key} className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-primary">{key}</h3>
                <Badge variant="secondary" className="text-yellow-500 font-bold">
                  {value.xp} XP
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {conclusion_multiplier && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-amber-500" />
              Bônus de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              A pontuação de iniciativas concluídas é multiplicada por{" "}
              <span className="font-bold text-primary">{conclusion_multiplier}</span>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}