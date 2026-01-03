import { ScoreData } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserScoreDisplayProps {
  score: ScoreData | null;
}

export function UserScoreDisplay({ score }: UserScoreDisplayProps) {
  if (!score) {
    return null; // Não renderiza nada se não houver score
  }

  const nivel = score.nivel_numerico;
  const xpTotal = score.total_xp;
  const titulo = score.titulo_atual;
  const xpFaltante = Number(score.xp_para_proximo_nivel);

  // TODO: A lógica de progresso assume que cada nível requer 100 XP.
  // Isso deve ser ajustado se a progressão de nível for diferente.
  const totalXpParaNivel = 100;
  const progresso = totalXpParaNivel > 0 ? ((totalXpParaNivel - xpFaltante) / totalXpParaNivel) * 100 : 0;

  // TODO: O título do próximo nível está fixo. Idealmente, viria da API.
  const proximoTitulo = "Estrategista";

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-end text-right cursor-default">
            <span className="text-sm font-medium leading-none">{xpTotal} XP • Nível {nivel} • {titulo}</span>
            <Progress value={progresso} className="h-1 w-24 mt-1.5" />
          </div>
        </TooltipTrigger>
        <TooltipContent><p>Faltam {xpFaltante} XP para {proximoTitulo}</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}