export interface Paradigma {
  novo_paradigma: string;
  paradigma_antigo: string;
  paradigma_detalhe: string;
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
}

export interface Sprint {
  id: string;
  nome: string;
  data_inicio: string;
  data_fim: string;
  status: "ativa" | "concluida";
  projeto_id: string;
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
  id: string;
  texto: string;
  data: string;
  periodo: "dia" | "semana" | "mes" | "ano";
}
