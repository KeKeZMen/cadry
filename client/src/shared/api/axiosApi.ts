import axios, { AxiosError, AxiosRequestConfig } from "axios";

export type ErrorResponseType = {
  message: string;
  error: string;
  statusCode: number;
};

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const baseAxios = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

baseAxios.interceptors.response.use(
  (config) => config,
  (error) => {
    throw error.response?.data as ErrorResponseType;
  }
);

export const axiosWithAuth = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

axiosWithAuth.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

axiosWithAuth.interceptors.response.use(
  (config) => config,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    if (error.status == 401 && error.config) {
      try {
        const response = await baseAxios.get<IAuthResponse>(`/auth/refresh`);
        localStorage.setItem("token", response.data.accessToken);
        return axiosWithAuth.request(originalRequest);
      } catch (error) {
        localStorage.removeItem("token");
        throw (error as AxiosError).response?.data as ErrorResponseType;
      }
    }

    throw error.response?.data as ErrorResponseType;
  }
);
