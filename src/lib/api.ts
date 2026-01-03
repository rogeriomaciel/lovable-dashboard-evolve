import { DiarioEntry, Iniciativa, LoginResponse, Paradigma, Projeto, ScoreData, SprintDashboardData, User } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_LOGIN = import.meta.env.VITE_API_LOGIN || "http://localhost:8000/api/login";
const API_LOGIN_AUTH_GOOGLE = import.meta.env.VITE_API_LOGIN_AUTH_GOOGLE || "http://localhost:8000/api/login";
const API_LOGIN_LINK_PHONE = import.meta.env.VITE_API_LOGIN_LINK_PHONE || "http://localhost:8000/api/login";


export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

let onUnauthorized: (() => void) | null = null;

export const setupInterceptors = (logout: () => void) => {
  onUnauthorized = logout;
};

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function customFetch<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    if ((response.status === 401 || response.status === 403) && onUnauthorized) {
      if (window.location.pathname !== '/login') {
        onUnauthorized();
      }
    }

    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || errorData.message || "Erro ao processar requisição"
    );
  }
  return response.json();
}

export const api = {
  async login(telefone: string, senha: string): Promise<LoginResponse> {
    const response = await fetch(`${API_LOGIN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: telefone, password: senha }),
    });
    // O login não usa o customFetch para não causar loop de logout em caso de senha errada (401)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.detail || errorData.message || "Erro ao processar requisição"
      );
    }
    return response.json();
  },

  async getProjetos(): Promise<Projeto[]> {
    return customFetch<Projeto[]>(`${API_BASE_URL}/projetos`, {
      headers: getAuthHeaders(),
    });
  },

  async getIniciativasFoco(): Promise<Iniciativa[]> {
    const response = await customFetch<any>(`${API_BASE_URL}/iniciativas`, {
      headers: getAuthHeaders(),
    });
    
    const data = Array.isArray(response) && response[0]?.iniciativas_em_andamento 
      ? response[0].iniciativas_em_andamento 
      : [];

    return data.map((i: any) => ({
      ...i,
      id: String(i.id),
      iniciativa_nome: i.nome,
      nome_projeto: i.projeto_nome,
    }));
  },

  async getParadigmas(): Promise<Paradigma[]> {
    const response = await customFetch<Paradigma[]>(`${API_BASE_URL}/paradigmas`, {
      headers: getAuthHeaders(),
    });
    // A API retorna [{ paradigmas: [...] }], então extraímos a lista interna
    return response && response.paradigmas ? response.paradigmas : [];
  },

  async getScore(): Promise<ScoreData | null> { 
    const response = await customFetch<ScoreData>(`${API_BASE_URL}/score`, {
      headers: getAuthHeaders(),
    });
    // A API retorna um array, então pegamos o primeiro item
    //return Array.isArray(response) && response.length > 0 ? response[0] : null;
    return response ? response : null;
  },

  async getProjeto(id: string): Promise<Projeto> {
    return customFetch<Projeto>(`${API_BASE_URL}/projeto?id=${id}`, {
      headers: getAuthHeaders(),
    });
  },

  async getSprintDashboard(id: string): Promise<SprintDashboardData> {
    const response = await customFetch<any>(`${API_BASE_URL}/sprint?id=${id}`, {
      headers: getAuthHeaders(),
    });
    
    const data = Array.isArray(response) ? response[0] : response;

    if (data && data.iniciativas_da_sprint) {
      data.iniciativas_da_sprint = data.iniciativas_da_sprint.map((i: any) => {
        let checklistItems = [];

        if (Array.isArray(i.checklist)) {
          checklistItems = i.checklist.map((item: any) => ({
            id: item.id,
            text: item.texto,
            status: item.feito ? "completed" : "pending"
          }));
        } else if (i.checklist?.items) {
          checklistItems = i.checklist.items;
        }

        return {
          ...i,
          iniciativa_nome: i.nome || i.iniciativa_nome,
          checklist_data: { items: checklistItems }
        };
      });
    }
    return data;
  },

  async loginWithGoogle(googleToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_LOGIN_AUTH_GOOGLE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ google_token: googleToken }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        errorData.error || errorData.message || "Erro ao fazer login com Google"
      );
    }
    return response.json();
  },

  async linkPhone(phoneNumber: string): Promise<{ ok: boolean; access_token: string; user: User; error?: string }> {
    return customFetch<{ ok: boolean; access_token: string; user: User; error?: string }>(
      `${API_LOGIN_LINK_PHONE}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ phone_number: phoneNumber }),
      }
    );
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return customFetch<{ message: string }>(
      `${API_BASE_URL}/change-password`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      }
    );
  },

  async getDiario(periodo?: string): Promise<DiarioEntry[]> {
    const query = periodo ? `?periodo=${periodo}` : "";
    return customFetch<DiarioEntry[]>(`${API_BASE_URL}/diario${query}`, {
      headers: getAuthHeaders(),
    });
  },
};
