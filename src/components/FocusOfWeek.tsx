import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Iniciativa } from "@/lib/types";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

function IniciativaItem({ iniciativa }: { iniciativa: Iniciativa }) {
  // Encontra a primeira tarefa pendente no checklist
  const proximaTarefa = iniciativa.checklist_data?.items.find(
    (item) => item.status === "pending"
  );

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <Badge variant="secondary" className="mb-2">
          {iniciativa.nome_projeto}
        </Badge>
        <p className="text-lg font-semibold text-primary">
          {iniciativa.iniciativa_nome}
        </p>
        {proximaTarefa ? (
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Próxima Ação:</span>{" "}
            {proximaTarefa.text}
          </p>
        ) : (
          <p className="mt-1 text-sm font-medium text-green-600">
            Checklist concluído!
          </p>
        )}
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
    </div>
  );
}

export function FocusOfWeek() {
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIniciativas() {
      try {
        const data = await api.getIniciativasFoco();
        setIniciativas(data);
      } catch (error: any) {
        toast({
          title: "Erro ao buscar iniciativas em foco",
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
    <Card>
      <CardHeader>
        <CardTitle>🎯 Meu Foco da Semana</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-20 w-full" />}
        {!isLoading && iniciativas.length === 0 && (
          <p className="text-muted-foreground">Nenhuma iniciativa em foco para esta semana.</p>
        )}
        {!isLoading && iniciativas.length > 0 && (
          <div className="space-y-2">
            {iniciativas.map((iniciativa) => (
              <IniciativaItem key={iniciativa.id} iniciativa={iniciativa} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}