export interface User {
  id: string;
  nome: string;
  telefone: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
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
  nome: string;
  descricao?: string;
  status: "A Fazer" | "Em Andamento" | "Concluído";
  checklist_data?: ChecklistData;
  projeto_id: string;
  sprint_id?: string;
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

export interface Projeto {
  id: string;
  nome_projeto: string;
  descricao: string;
  sprints?: Sprint[];
  iniciativas?: Iniciativa[];
  sprints_concluidas?: number;
  iniciativas_ativas?: number;
}
