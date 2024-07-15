import axios, { AxiosError, AxiosRequestConfig } from "axios";

export type ErrorResponseType = {
  message: string;
  error: string;
  statusCode: number;
};

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig;

    if (error.status == 401 && error.config) {
      try {
        const response = await axios.get<IAuthResponse>(
          `${API_URL}/auth/refresh`,
          { withCredentials: true }
        );
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (error) {
        localStorage.removeItem("token");
        throw (error as AxiosError).response?.data as ErrorResponseType;
      }
    }

    throw error.response?.data as ErrorResponseType;
  }
);
