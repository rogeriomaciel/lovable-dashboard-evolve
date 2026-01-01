import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Iniciativa } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Target, ArrowRight, CheckCircle2 } from "lucide-react";

function IniciativaItem({ iniciativa }: { iniciativa: Iniciativa }) {
  const proximaTarefa = iniciativa.checklist_data?.items.find(
    (item) => item.status === "pending"
  );

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50 hover:shadow-sm">
      <div className="mt-0.5 shrink-0">
        {proximaTarefa ? (
          <Target className="h-4 w-4 text-primary" />
        ) : (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <Badge variant="secondary" className="mb-1.5 text-xs">
          {iniciativa.nome_projeto}
        </Badge>
        <p className="font-medium text-sm text-foreground truncate">
          {iniciativa.iniciativa_nome}
        </p>
        {proximaTarefa ? (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            <span className="font-medium">Próxima:</span> {proximaTarefa.text}
          </p>
        ) : (
          <p className="mt-1 text-xs font-medium text-green-600">
            ✓ Checklist concluído
          </p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
    </div>
  );
}

export function ActiveInitiatives() {
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIniciativas() {
      try {
        const data = await api.getIniciativasFoco();
        setIniciativas(data);
      } catch (error: any) {
        toast({
          title: "Erro ao buscar iniciativas",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchIniciativas();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Iniciativas em Andamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : iniciativas.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma iniciativa em andamento.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {iniciativas.map((iniciativa) => (
              <IniciativaItem key={iniciativa.id} iniciativa={iniciativa} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
