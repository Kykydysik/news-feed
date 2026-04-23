import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

class HttpClient {
  protected readonly instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:3000',
    });

    this._initializeResponseInterceptor();
    this._initializeRequestInterceptor();
  }

  get<T, K = unknown, D = unknown>(
    url: string,
    params?: K,
    headers?: D,
  ): Promise<T> {
    return this.instance.get(url, { params, ...headers });
  }

  post<T, K = unknown>(url: string, params?: K): Promise<T> {
    return this.instance.post(url, params);
  }

  delete<T = unknown>(url: string): Promise<T> {
    return this.instance.delete(url);
  }

  patch<T, K>(url: string, params?: K): Promise<T> {
    return this.instance.patch(url, params);
  }

  private _initializeResponseInterceptor = () => {
    this.instance.interceptors.response.use(
      this._handleResponse,
      this._handleError,
    );
  };

  private _initializeRequestInterceptor = () => {
    this.instance.interceptors.request.use(this._handleRequest);
  };

  private _handleRequest = async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');

    if (config.headers && token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    return config;
  };

  private _handleResponse = (response: AxiosResponse) => {
    return response.data;
  };

  protected _handleError = async (error: AxiosError) => {
    return Promise.reject(error);
  };
}

export const httpClient = new HttpClient();
