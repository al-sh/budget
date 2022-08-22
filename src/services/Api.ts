import axios, { AxiosError, AxiosPromise } from 'axios';
import { getStorage } from './Storage';
import { UI_ROUTES } from '../constants/urls';

interface ApiRequest<ReqBody, ReqQuery> {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: ReqBody;
  query?: ReqQuery;
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

  private constructor() {
    console.log('ApiService create. path:', this.path);
  }

  private path = `${window.location.origin}/api`;

  public send: <Result, RequestBody = null, RequestQuery = null>(request: ApiRequest<RequestBody, RequestQuery>) => Promise<Result> =
    async (request) => {
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
              window.location.href = `${window.location.origin}${UI_ROUTES.SETTINGS.LOGIN}`;
            }
            reject(error);
          });
      });
    };
}

export const getApi = () => ApiService.getInstance();
