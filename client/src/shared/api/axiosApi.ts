import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

// $api.interceptors.response.use(
//   (config) => config,
//   async (error) => {
//     const originalRequest = error.config as AxiosResponse<any, any>;
//     const errorStatus = error.response?.status;

//     if (errorStatus == 401 && error.config && !error.config._isRetry) {
//       originalRequest._isRetry = true;

//       try {
//         const response = await axios.get<IAuthResponse>(
//           `${API_URL}/auth/refresh`,
//           { withCredentials: true }
//         );
//         localStorage.setItem("token", response.data.accessToken);
//         return $api.request(originalRequest);
//       } catch (error) {
//         throw error;
//       }
//     }

//     throw error;
//   }
// );

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
      }
    }
  }
);
