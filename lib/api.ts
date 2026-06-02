/**
 * Cliente HTTP centralizado.
 * O token JWT é injetado automaticamente em todas as requisições
 * autenticadas. Para uso nos hooks, passe o token do AuthContext.
 */
import { API_BASE_URL } from "./apiEndpoints";

interface RequestOptions extends RequestInit {
  token?: string | null;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, headers, ...rest } = options;

  const mergedHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: mergedHeaders,
  });

  if (!response.ok) {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    const message =
      (body as { message?: string })?.message ??
      `Erro ${response.status}: ${response.statusText}`;

    throw new ApiError(response.status, message, body);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
