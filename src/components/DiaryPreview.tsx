import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DiarioEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { BookOpen } from "lucide-react";

type Periodo = "dia" | "semana" | "mes" | "ano";

export function DiaryPreview() {
  const [entries, setEntries] = useState<Record<Periodo, DiarioEntry | null>>({
    dia: null,
    semana: null,
    mes: null,
    ano: null,
  });
  const [activePeriodo, setActivePeriodo] = useState<Periodo>("dia");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDiario() {
      try {
        const data = await api.getDiario();
        const byPeriodo: Record<Periodo, DiarioEntry | null> = {
          dia: null,
          semana: null,
          mes: null,
          ano: null,
        };
        
        data.forEach((entry) => {
          if (!byPeriodo[entry.periodo]) {
            byPeriodo[entry.periodo] = entry;
          }
        });
        
        setEntries(byPeriodo);
      } catch (error: any) {
        // API pode não estar pronta ainda, apenas log silencioso
        console.log("Diário não disponível:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDiario();
  }, []);

  const periodoLabels: Record<Periodo, string> = {
    dia: "Hoje",
    semana: "Semana",
    mes: "Mês",
    ano: "Ano",
  };

  const currentEntry = entries[activePeriodo];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Meu Diário
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activePeriodo} onValueChange={(v) => setActivePeriodo(v as Periodo)}>
          <TabsList className="mb-4">
            {(Object.keys(periodoLabels) as Periodo[]).map((periodo) => (
              <TabsTrigger key={periodo} value={periodo}>
                {periodoLabels[periodo]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            (Object.keys(periodoLabels) as Periodo[]).map((periodo) => (
              <TabsContent key={periodo} value={periodo} className="mt-0">
                {entries[periodo] ? (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-sm leading-relaxed text-foreground">
                      {entries[periodo]?.texto}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {entries[periodo]?.data}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Nenhuma entrada para este período.
                    </p>
                  </div>
                )}
              </TabsContent>
            ))
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
