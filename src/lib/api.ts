import { LoginResponse, Projeto, User } from "./types";

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
    return customFetch<Projeto[]>(`${API_BASE_URL}/:projetos`, {
      headers: getAuthHeaders(),
    });
  },

  async getProjeto(id: string): Promise<Projeto> {
    return customFetch<Projeto>(`${API_BASE_URL}/:projetos/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  async updateIniciativaChecklist(
    iniciativaId: string,
    checklistData: any
  ): Promise<void> {
    return customFetch<void>(`${API_BASE_URL}/:iniciativas/${iniciativaId}/checklist`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ checklist_data: checklistData }),
    });
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

  async linkPhone(phoneNumber: string): Promise<{ ok: boolean; user: User; error?: string }> {
    return customFetch<{ ok: boolean; user: User; error?: string }>(
      `${API_LOGIN_LINK_PHONE}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ phone_number: phoneNumber }),
      }
    );
  },
};
