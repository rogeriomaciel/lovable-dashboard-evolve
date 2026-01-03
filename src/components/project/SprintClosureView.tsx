import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DadosFechamento } from "@/lib/types";
import { Trophy, AlertTriangle, CheckCircle2, ScrollText, Quote } from "lucide-react";

interface SprintClosureViewProps {
  data: DadosFechamento;
}

export function SprintClosureView({ data }: SprintClosureViewProps) {
  const { conclusao_lider, diario_bordo, relatorio_ia } = data;
  const { snapshot_json } = relatorio_ia;
  const { resumo_numerico } = snapshot_json;

  // Helper para renderizar listas simples a partir de markdown básico
  const renderList = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const cleanLine = line.trim().replace(/^\*\s*/, '');
      if (!cleanLine) return null;
      
      // Processamento simples de negrito (**texto**)
      const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={i} className="mb-2 flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
          <p className="text-sm">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j}>{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Resumo Numérico */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold">{resumo_numerico.vitorias}</p>
            <p className="text-sm text-muted-foreground">Vitórias</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="h-8 w-8 flex items-center justify-center text-primary font-bold text-xl mb-2">XP</div>
            <p className="text-2xl font-bold">{resumo_numerico.xp_total_gerado}</p>
            <p className="text-sm text-muted-foreground">XP Gerado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-2xl font-bold">{resumo_numerico.blockers}</p>
            <p className="text-sm text-muted-foreground">Bloqueios</p>
          </CardContent>
        </Card>
      </div>

      {/* Conclusão do Líder */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Quote className="h-5 w-5 text-primary" />
            Conclusão do Líder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium italic">"{conclusao_lider}"</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Hall das Vitórias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Hall das Vitórias
            </CardTitle>
          </CardHeader>
          <CardContent>{renderList(snapshot_json.hall_vitorias_md)}</CardContent>
        </Card>

        {/* Entregas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Entregas Realizadas
            </CardTitle>
          </CardHeader>
          <CardContent>{renderList(snapshot_json.lista_entregas_md)}</CardContent>
        </Card>
      </div>

      {/* Diário de Bordo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            Diário de Bordo da Sprint
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground font-mono bg-muted/30 p-4 rounded-md">
            {diario_bordo}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}