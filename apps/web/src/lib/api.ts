 import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';        
  import { API_URL, ROUTES } from '@/config/constants';
  import { ApiError } from '@/types';

  class ApiClient {
    private instance: AxiosInstance;

    constructor() {
      this.instance = axios.create({
        baseURL: API_URL,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      this.setupInterceptors();
    }

    private setupInterceptors() {
      // Request interceptor
      this.instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
          if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      // Response interceptor
      this.instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError<ApiError>) => {
          if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('organization');
              window.location.href = ROUTES.LOGIN;
            }
          }
          return Promise.reject(this.handleError(error));
        }
      );
    }

    private handleError(error: AxiosError<ApiError>): Error {
      if (error.response?.data?.error) {
        return new Error(error.response.data.error);
      }
      if (error.message === 'Network Error') {
        return new Error('Unable to connect to server. Please check your internetconnection.');
      }
      if (error.code === 'ECONNABORTED') {
        return new Error('Request timed out. Please try again.');
      }
      return new Error('An unexpected error occurred. Please try again.');
    }

    // Generic request methods
    async get<T>(url: string, params?: object): Promise<T> {
      const response = await this.instance.get<T>(url, { params });
      return response.data;
    }

    async post<T>(url: string, data?: object): Promise<T> {
      const response = await this.instance.post<T>(url, data);
      return response.data;
    }

    async put<T>(url: string, data?: object): Promise<T> {
      const response = await this.instance.put<T>(url, data);
      return response.data;
    }

    async patch<T>(url: string, data?: object): Promise<T> {
      const response = await this.instance.patch<T>(url, data);
      return response.data;
    }

    async delete<T>(url: string): Promise<T> {
      const response = await this.instance.delete<T>(url);
      return response.data;
    }
  }

  const api = new ApiClient();
  export default api;
