import { useAuthStore } from "@/modules/auth/store/use-auth";
import { ROUTER } from "@/router";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

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
    const nvToken = getCookie("new-vision-token");
    if (nvToken) {
      config.headers.Authorization = `Bearer ${nvToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.message?.code;
    const isLoginAuthError = code === "unauthorized_login";
    if ((status === 401 || status === 403) && !isLoginAuthError) {
      deleteCookie("new-vision-token");
      useAuthStore.getState().clearUser();
      console.log({ error });
      if (typeof window !== "undefined") {
        window.location.href = ROUTER.LOGIN;
      }
    }
    console.log("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
