import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DiarioEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type PeriodType = "dia" | "semana" | "mes" | "ano";

export function DiaryPreview() {
  const [entries, setEntries] = useState<DiarioEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("semana");
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Filtra entradas pelo período selecionado
  const getFilteredEntries = (period: PeriodType): DiarioEntry[] => {
    return entries.filter(entry => {
      const origem = entry.origem_registro?.toLowerCase() || "";
      switch (period) {
        case "dia":
          return origem.includes("dia") || origem.includes("daily");
        case "semana":
          return origem.includes("semana") || origem.includes("week") || origem === "chat";
        case "mes":
          return origem.includes("mes") || origem.includes("month");
        case "ano":
          return origem.includes("ano") || origem.includes("year");
        default:
          return true;
      }
    });
  };

  // Se não houver filtro específico, mostra todas as entradas na aba selecionada
  const filteredEntries = getFilteredEntries(selectedPeriod);
  const displayEntries = filteredEntries.length > 0 ? filteredEntries : entries;
  const currentEntry = displayEntries[currentIndex];

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

  const handlePrevious = () => {
    if (currentIndex < displayEntries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Reset index quando muda o período
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedPeriod]);

  const periodLabels: Record<PeriodType, string> = {
    dia: "Dia",
    semana: "Semana",
    mes: "Mês",
    ano: "Ano"
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="h-5 w-5 text-primary" />
          Meu Diário
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs 
          value={selectedPeriod} 
          onValueChange={(v) => setSelectedPeriod(v as PeriodType)}
          className="flex flex-col flex-1"
        >
          <TabsList className="grid w-full grid-cols-4 mb-3">
            {(Object.keys(periodLabels) as PeriodType[]).map((period) => (
              <TabsTrigger key={period} value={period} className="text-xs">
                {periodLabels[period]}
              </TabsTrigger>
            ))}
          </TabsList>

          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : displayEntries.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center flex-1 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma entrada no diário para este período.
              </p>
            </div>
          ) : (
            <div className="flex flex-col flex-1">
              {/* Navegação entre entradas */}
              {displayEntries.length > 1 && (
                <div className="flex items-center justify-between mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentIndex >= displayEntries.length - 1}
                    className="h-7 px-2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {currentIndex + 1} de {displayEntries.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentIndex <= 0}
                    className="h-7 px-2"
                  >
                    Recente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}

              {currentEntry && (
                <div className="flex flex-col flex-1">
                  {/* Header com data */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium">{formatDataReferencia(currentEntry.data_referencia)}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{formatPeriodo(currentEntry)}</span>
                    {currentEntry.origem_registro && (
                      <>
                        <span className="text-muted-foreground/50">•</span>
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] uppercase">
                          {currentEntry.origem_registro}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Conteúdo do diário */}
                  <ScrollArea className="flex-1 rounded-lg bg-muted/30 border">
                    <div className="p-4 min-h-[200px] max-h-[400px]">
                      <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                        {currentEntry.conteudo}
                      </p>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
