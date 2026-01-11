export interface Paradigma {
  novo_paradigma: string;
  paradigma_antigo: string;
  paradigma_detalhe: string;
}

export interface ScoreData {
  usuario_id: number;
  nome_usuario: string;
  total_xp: string;
  nivel_numerico: number;
  titulo_atual: string;
  xp_para_proximo_nivel: string;
}

export interface RankingItem {
  usuario_id: number;
  nome_usuario: string;
  xp_no_projeto: string;
  total_interacoes: string;
  ultima_interacao: string;
  status_no_projeto: string;
}

export interface User {
  id: string;
  name: string;
  phone_number: string | null;
  email?: string;
  auth_provider?: "phone" | "google";
  paradigmas?: Paradigma[];
}

export interface Payload {
  name: string;
  email: string;
  id: string;
  phone_number: string;
}

export interface LoginResponse {
  access_token: string;
  payload?: Payload;
  user?: User;
  needs_phone?: boolean;
  ok: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  status: "pending" | "completed";
}

export interface ChecklistData {
  items: ChecklistItem[];
}

export interface Iniciativa {
  id: string;
  iniciativa_nome: string;
  descricao?: string;
  checklist_data?: ChecklistData;
  projeto_id: string;
  sprint_id?: string;
  nome_projeto?: string;
  status: "A Fazer" | "Em Andamento" | "Concluído" | "Bloqueado";
  ultimo_update?: string;
  responsavel_nome?: string;
  responsavel_phone?: string;
}

export interface Sprint {
  id: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  status: "ativa" | "concluida";
  projeto_id: string;
  objetivo?: string;
  resumo_evolucao?: {
    positivos: string[];
    desafios: string[];
    licoes: string[];
  };
}

export interface LeanCanvas {
  Canais: string[];
  Problema: {
    problema_1: string | null;
    problema_2: string | null;
    problema_3: string | null;
  };
  Solução: string;
  "Métricas Chave": string[];
  "Fontes de Receita": string[];
  "Estrutura de Custos": string[];
  "Segmento de Clientes": string;
  "Proposta de Valor Única": string;
}

export interface Projeto {
  id: string;
  nome_projeto: string;
  descricao: string;
  sprints?: Sprint[];
  iniciativas?: Iniciativa[];
  sprints_concluidas?: number;
  iniciativas_ativas?: number;
  lean_canvas?: LeanCanvas;
}

export interface DiarioEntry {
  id: number;
  usuario_id: number;
  conteudo: string;
  data_referencia: string;
  periodo_inicio: string;
  periodo_fim: string;
  origem_registro: string;
  created_at: string;
  updated_at: string;
}

export interface SprintActivity {
  data: string;
  xp_gerado: number;
  updates_count: number;
}

export interface SprintBlocker {
  id: string; // iniciativa_id
  iniciativa_nome: string;
  texto_blocker: string;
  responsavel: string;
  data_reporte: string;
}

export interface SnapshotJSON {
  data_fechamento: string;
  resumo_numerico: {
    blockers: string;
    vitorias: string;
    xp_total_gerado: string;
  };
  hall_vitorias_md: string;
  lista_entregas_md: string;
  mural_frustracoes: string;
}

export interface RelatorioIA {
  sprintId: number;
  userMessage: string;
  snapshot_json: SnapshotJSON;
  lista_entregas: string;
  hall_das_vitorias: string;
  timeline_destaques: string;
  novo_estado_usuario: string;
}

export interface DadosFechamento {
  conclusao_lider: string;
  diario_bordo: string;
  relatorio_ia: RelatorioIA;
}

export interface SprintDashboardData {
  sprint_id: number;
  projeto_id: string;
  nome_sprint: string;
  objetivo_principal: string;
  status: string;
  data_inicio: string;
  data_fim: string;
  hoje: string;
  duracao_total_dias: number;
  dias_restantes: number;
  percentual_tempo_decorrido: string;
  total_iniciativas: string;
  iniciativas_concluidas: string;
  progresso_geral_sprint: string;
  alertas_impedimentos: SprintBlocker[];
  grafico_atividade: SprintActivity[];
  iniciativas_da_sprint: Iniciativa[];
  pagina_estrategica?: any;
  dados_fechamento?: DadosFechamento;
}
