import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL +
  "/" +
  process.env.NEXT_PUBLIC_API_PATH +
  "/" +
  process.env.NEXT_PUBLIC_API_VERSION;

export const apiClient = axios.create({
  baseURL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
