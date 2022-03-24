import axios, { AxiosPromise } from 'axios';
import { useStorage } from './Storage';

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
      ApiService.instance = new ApiService();
    }

    return ApiService.instance;
  }

  private path = 'http://localhost:3001';

  public send: <T>(request: ApiRequest) => ApiResponse<T> = async (request) => {
    const { endpoint, method, data, query } = request;
    // await this.authService.checkToken();

    const url = `${this.path}/${endpoint}`;

    // цель доработки - если пришёл код 401, то должен быть редирект на логин useNavigate хук
    /*const response = axios({
      //todo: доделать
      data,
      headers: { Auth: useStorage().getItem('token') },
      method,
      params: query,
      url,
    });*/
    return new Promise((resolve, reject) => {
      axios({
        // тут вернуть новый промис
        data,
        headers: { Auth: useStorage().getItem('token') },
        method,
        params: query,
        url,
      })
        .then((response) => {
          console.log('status', response.status);

          resolve(response);
        })
        .catch((error) => {
          console.log(error.response);
          if (error.response.status === 401) {
            console.log('redirect to login');
            window.location.href = `${window.location.origin}/login`;
          }
          reject(error);
        });
    });
  };
}

export const useApi = () => ApiService.getInstance();
