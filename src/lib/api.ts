import { LoginResponse, Projeto } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_LOGIN = import.meta.env.VITE_API_LOGIN || "http://localhost:8000/api/login";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
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
    return handleResponse<LoginResponse>(response);;
  },

  async getProjetos(): Promise<Projeto[]> {
    const response = await fetch(`${API_BASE_URL}/:projetos`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Projeto[]>(response);
  },

  async getProjeto(id: string): Promise<Projeto> {
    const response = await fetch(`${API_BASE_URL}/:projetos/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<Projeto>(response);
  },

  async updateIniciativaChecklist(
    iniciativaId: string,
    checklistData: any
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/:iniciativas/${iniciativaId}/checklist`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ checklist_data: checklistData }),
    });
    return handleResponse<void>(response);
  },
};
