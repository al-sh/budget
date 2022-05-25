import axios, { AxiosError, AxiosPromise } from 'axios';
import { getStorage } from './Storage';

interface ApiRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: Record<string, unknown>;
  query?: { [key: string]: string };
}

export type ApiResponse<T = Record<string, unknown>> = AxiosPromise<T>;

class ApiService {
  private static instance: ApiService;

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      console.log('ApiService - create');
      ApiService.instance = new ApiService();
    }

    return ApiService.instance;
  }

  private constructor() {}

  private path = process.env.REACT_APP_API_PATH;

  public send: <T>(request: ApiRequest) => Promise<T> = async (request) => {
    const { endpoint, method, data, query } = request;
    const url = `${this.path}/${endpoint}`;

    return new Promise((resolve, reject) => {
      axios({
        data,
        headers: { Auth: getStorage().getItem('token'), UserId: getStorage().getItem('userId') },
        method,
        params: query,
        url,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error: AxiosError) => {
          console.log(error.response);
          if (error.response && error.response?.status === 401) {
            console.log('redirected to login');
            window.location.href = `${window.location.origin}/login`;
          }
          reject(error);
        });
    });
  };
}

export const getApi = () => ApiService.getInstance();
