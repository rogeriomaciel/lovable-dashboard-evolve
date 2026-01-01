import { LeanCanvas } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

interface LeanCanvasViewProps {
  canvas: LeanCanvas;
}

function CanvasBlock({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border bg-card p-3 ${className}`}>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function ListItems({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-primary mt-1">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LeanCanvasView({ canvas }: LeanCanvasViewProps) {
  const problemas = [
    canvas.Problema.problema_1,
    canvas.Problema.problema_2,
    canvas.Problema.problema_3,
  ].filter(Boolean) as string[];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <LayoutGrid className="h-5 w-5 text-primary" />
          Lean Canvas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Layout do Lean Canvas - Grid adaptado */}
        <div className="grid gap-3 md:grid-cols-5 md:grid-rows-2">
          {/* Linha 1 */}
          <CanvasBlock title="Problema" className="md:row-span-2">
            <ListItems items={problemas} />
          </CanvasBlock>

          <CanvasBlock title="Solução">
            <p>{canvas.Solução}</p>
          </CanvasBlock>

          <CanvasBlock title="Proposta de Valor Única" className="md:row-span-2">
            <p className="font-medium text-primary">
              {canvas["Proposta de Valor Única"]}
            </p>
          </CanvasBlock>

          <CanvasBlock title="Canais">
            <ListItems items={canvas.Canais} />
          </CanvasBlock>

          <CanvasBlock title="Segmento de Clientes" className="md:row-span-2">
            <p>{canvas["Segmento de Clientes"]}</p>
          </CanvasBlock>

          {/* Linha 2 */}
          <CanvasBlock title="Métricas Chave">
            <ListItems items={canvas["Métricas Chave"]} />
          </CanvasBlock>

          <CanvasBlock title="Fontes de Receita">
            <ListItems items={canvas["Fontes de Receita"]} />
          </CanvasBlock>
        </div>

        {/* Linha de custos - Full width */}
        <div className="mt-3">
          <CanvasBlock title="Estrutura de Custos">
            <ListItems items={canvas["Estrutura de Custos"]} />
          </CanvasBlock>
        </div>
      </CardContent>
    </Card>
  );
}
