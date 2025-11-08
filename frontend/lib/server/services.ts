import { apiClient } from "./api-client";
import { API_CONFIG } from "./config";

/**
 * Tipos de datos
 */
export interface CreateUserDTO {
  name: string;
  lastName: string;
  email: string;
  wallet: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  name: string;
  lastName: string;
  email: string;
  wallet: string;
  createdAt: string;
  createdCampaigns?: Campaign[];
  campaigns?: Campaign[];
}

export interface LoginResponse {
  access_token: string;
}

export interface DecodedToken {
  email: string;
  uuid: string;
  role: string[];
  iat: number;
  exp: number;
}

/**
 * Servicios de Autenticación
 */
export const authService = {
  /**
   * Crear nuevo usuario
   */
  async createUser(data: CreateUserDTO): Promise<UserResponse> {
    return apiClient.post<UserResponse>(
      API_CONFIG.endpoints.auth.createUser,
      data
    );
  },

  /**
   * Iniciar sesión
   */
  async login(data: LoginDTO): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_CONFIG.endpoints.auth.login, data);
  },

  /**
   * Decodificar token JWT
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replaceAll("-", "+").replaceAll("_", "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (c) => "%" + ("00" + (c.codePointAt(0) ?? 0).toString(16)).slice(-2)
          )
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  /**
   * Guardar token en sessionStorage
   */
  saveToken(token: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("access_token", token);
    }
  },

  /**
   * Obtener token de sessionStorage
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("access_token");
    }
    return null;
  },

  /**
   * Guardar información del usuario decodificada
   */
  saveUserInfo(tokenData: DecodedToken): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user_info", JSON.stringify(tokenData));
    }
  },

  /**
   * Obtener información del usuario
   */
  getUserInfo(): DecodedToken | null {
    if (typeof window !== "undefined") {
      const userInfo = sessionStorage.getItem("user_info");
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  },

  /**
   * Cerrar sesión
   */
  logout(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user_info");
    }
  },
};

/**
 * Servicios de Usuarios
 */
export const userService = {
  /**
   * Obtener información de usuario
   */
  async getUserInformation(id: string, token: string): Promise<UserResponse> {
    return apiClient.get<UserResponse>(
      API_CONFIG.endpoints.users.getUserInformation(id),
      { token }
    );
  },
};

/**
 * Tipos para Campañas
 */
export interface Campaign {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  currentParticipants: number;
  totalParticipants: number;
  goal: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  token: number;
  campaignStatus: string;
  createAt: string;
  onchainTxHash?: string;
  onchainCampaignId?: string;
  creator?: {
    id: string;
    name: string;
    lastName: string;
    email: string;
    wallet: string;
  };
}

export interface CreateCampaignDTO {
  createdUserId: string;
  name: string;
  description: string;
  country: string;
  city: string;
  address: string;
  totalParticipants: number;
  goal: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  token?: number;
}

/**
 * Servicios de Campañas
 */
export const campaignService = {
  /**
   * Obtener todas las campañas
   */
  async getAllCampaigns(): Promise<Campaign[]> {
    return apiClient.get<Campaign[]>(
      API_CONFIG.endpoints.campaigns.getAllCampaigns
    );
  },

  /**
   * Obtener una campaña por ID
   */
  async getCampaign(id: string): Promise<Campaign> {
    return apiClient.get<Campaign>(
      API_CONFIG.endpoints.campaigns.getCampaign(id)
    );
  },

  /**
   * Crear nueva campaña
   */
  async createCampaign(
    data: CreateCampaignDTO,
    token: string
  ): Promise<Campaign> {
    return apiClient.post<Campaign>(
      API_CONFIG.endpoints.campaigns.createCampaign,
      data,
      { token }
    );
  },

  /**
   * Actualizar campaña
   */
  async updateCampaign(
    id: string,
    data: Partial<CreateCampaignDTO>,
    token: string
  ): Promise<Campaign> {
    return apiClient.put<Campaign>(
      API_CONFIG.endpoints.campaigns.updateCampaign(id),
      data,
      { token }
    );
  },

  /**
   * Eliminar campaña
   */
  async deleteCampaign(id: string, token: string): Promise<void> {
    return apiClient.delete<void>(
      API_CONFIG.endpoints.campaigns.deleteCampaign(id),
      { token }
    );
  },

  /**
   * Aprobar campaña (solo admin)
   */
  async approveCampaign(
    campaingId: string,
    token: number,
    authToken: string
  ): Promise<Campaign> {
    return apiClient.put<Campaign>(
      "/campaing/approveCampaing",
      { campaingId, token },
      { token: authToken }
    );
  },

  /**
   * Unirse a una campaña
   */
  async joinCampaign(
    campaingId: string,
    userId: string,
    authToken: string
  ): Promise<Campaign> {
    return apiClient.put<Campaign>(
      "/campaing/joinCampaing",
      { campaingId, userId },
      { token: authToken }
    );
  },
};
