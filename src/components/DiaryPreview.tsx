import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DiarioEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DiaryPreview() {
  const [entries, setEntries] = useState<DiarioEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDiario() {
      try {
        const data = await api.getDiario();
        // Ordena por data_referencia decrescente (mais recente primeiro)
        const sorted = data.sort((a, b) => 
          new Date(b.data_referencia).getTime() - new Date(a.data_referencia).getTime()
        );
        setEntries(sorted);
      } catch (error: any) {
        console.log("Diário não disponível:", error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDiario();
  }, []);

  const formatPeriodo = (entry: DiarioEntry) => {
    try {
      const inicio = parseISO(entry.periodo_inicio);
      const fim = parseISO(entry.periodo_fim);
      const inicioFormatted = format(inicio, "dd MMM", { locale: ptBR });
      const fimFormatted = format(fim, "dd MMM yyyy", { locale: ptBR });
      return `${inicioFormatted} - ${fimFormatted}`;
    } catch {
      return "";
    }
  };

  const formatDataReferencia = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  // Pega a entrada mais recente para exibir
  const latestEntry = entries[0];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Meu Diário
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : latestEntry ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDataReferencia(latestEntry.data_referencia)}</span>
              <span className="text-muted-foreground/50">•</span>
              <span>{formatPeriodo(latestEntry)}</span>
            </div>
            <div className="rounded-lg bg-muted/50 p-4 max-h-64 overflow-y-auto">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {latestEntry.conteudo}
              </p>
            </div>
            {entries.length > 1 && (
              <p className="text-xs text-muted-foreground text-center">
                +{entries.length - 1} {entries.length - 1 === 1 ? "entrada anterior" : "entradas anteriores"}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhuma entrada no diário ainda.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
