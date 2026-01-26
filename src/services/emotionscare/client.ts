import { getAccessToken, clearTokens, refreshAccessToken, getMockToken } from './auth';
import type { ApiError } from './types';

const API_URL = import.meta.env.VITE_EMOTIONSCARE_API_URL || 'https://api.emotionscare.app';
const API_VERSION = '1.0.0';

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

class EmotionsCareClient {
  private baseUrl: string;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = `${baseUrl}/api/context-lens`;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    let token = await getAccessToken();
    
    // Fallback to mock token for demo
    if (!token) {
      token = getMockToken();
    }
    
    return {
      'Content-Type': 'application/json',
      'X-Context-Lens-Version': API_VERSION,
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      // Handle 401 - try refresh
      if (response.status === 401) {
        try {
          await refreshAccessToken();
          // Caller should retry the request
          throw { code: 'TOKEN_REFRESHED', status: 401, retry: true };
        } catch (refreshError) {
          clearTokens();
          throw { 
            code: 'UNAUTHORIZED', 
            message: 'Authentication failed', 
            status: 401 
          } as ApiError;
        }
      }
      
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          code: 'UNKNOWN_ERROR',
          message: response.statusText,
          status: response.status,
        };
      }
      
      throw errorData;
    }
    
    const data = await response.json();
    return {
      data,
      status: response.status,
      headers: response.headers,
    };
  }

  async get<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = 30000, ...fetchConfig } = config;
    
    const controller = new AbortController();
    const requestId = `${path}-${Date.now()}`;
    this.abortControllers.set(requestId, controller);
    
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(this.buildUrl(path, params), {
        method: 'GET',
        headers: await this.getAuthHeaders(),
        signal: controller.signal,
        ...fetchConfig,
      });
      
      const result = await this.handleResponse<T>(response);
      return result.data;
    } finally {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
    }
  }

  async post<T>(path: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = 30000, ...fetchConfig } = config;
    
    const controller = new AbortController();
    const requestId = `${path}-${Date.now()}`;
    this.abortControllers.set(requestId, controller);
    
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(this.buildUrl(path, params), {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...fetchConfig,
      });
      
      const result = await this.handleResponse<T>(response);
      return result.data;
    } finally {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
    }
  }

  async put<T>(path: string, body?: unknown, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = 30000, ...fetchConfig } = config;
    
    const controller = new AbortController();
    const requestId = `${path}-${Date.now()}`;
    this.abortControllers.set(requestId, controller);
    
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(this.buildUrl(path, params), {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        ...fetchConfig,
      });
      
      const result = await this.handleResponse<T>(response);
      return result.data;
    } finally {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
    }
  }

  async delete<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { params, timeout = 30000, ...fetchConfig } = config;
    
    const controller = new AbortController();
    const requestId = `${path}-${Date.now()}`;
    this.abortControllers.set(requestId, controller);
    
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(this.buildUrl(path, params), {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
        signal: controller.signal,
        ...fetchConfig,
      });
      
      const result = await this.handleResponse<T>(response);
      return result.data;
    } finally {
      clearTimeout(timeoutId);
      this.abortControllers.delete(requestId);
    }
  }

  // Cancel all pending requests
  cancelAll(): void {
    this.abortControllers.forEach((controller) => controller.abort());
    this.abortControllers.clear();
  }

  // Get mesh URL with token for direct Three.js loading
  async getMeshUrl(path: string, params?: Record<string, string>): Promise<string> {
    const token = await getAccessToken() || getMockToken();
    const url = new URL(`${this.baseUrl}${path}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    if (token) {
      url.searchParams.append('token', token);
    }
    
    return url.toString();
  }
}

export const apiClient = new EmotionsCareClient(API_URL);
