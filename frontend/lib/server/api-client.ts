import { API_CONFIG } from "./config";

/**
 * Clase para manejar errores de la API
 */
export class APIError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Opciones para las peticiones HTTP
 */
interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Cliente HTTP para hacer peticiones al backend
 */
class APIClient {
  private readonly baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Método privado para hacer peticiones HTTP
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, headers: customHeaders, ...restOptions } = options;

    const headers: Record<string, string> = {
      ...API_CONFIG.headers,
      ...(customHeaders as Record<string, string>),
    };

    // Agregar token si existe
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers,
      });

      // Parsear respuesta JSON
      const data = await response.json();

      // Si la respuesta no es ok, lanzar error
      if (!response.ok) {
        throw new APIError(
          data.message || "Error en la petición",
          response.status,
          data
        );
      }

      return data;
    } catch (error) {
      // Si es un APIError, re-lanzarlo
      if (error instanceof APIError) {
        throw error;
      }

      // Si es un error de red u otro, crear un APIError
      throw new APIError(
        error instanceof Error ? error.message : "Error de conexión",
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

// Instancia singleton del cliente
export const apiClient = new APIClient(API_CONFIG.baseURL);
