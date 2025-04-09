import { useAuthStore } from "@/modules/auth/store/use-auth";
import { ROUTER } from "@/router";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
import { getErrorMessage, showErrorToast, dispatchErrorEvent, errorEvent } from "@/utils/errorHandler";

export const baseURL =
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
    
    // Add language headers
    const lang = getCookie("NEXT_LOCALE");
    config.headers.Lang = lang || 'ar';
    config.headers['Accept-Language'] = lang || 'ar';
    
    // Add current domain to headers
    if (typeof window !== 'undefined') {
      config.headers['X-Domain'] = window.location.hostname;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('in interceptor.... ')
    const status = error.response?.status;
    const errorMessageKey = getErrorMessage(error);

    // Handle authentication errors
    if (status === 401 || status === 403) {
      // Don't redirect if we're already on the login page
      const isLoginPage = typeof window !== "undefined" &&
        window.location.pathname.includes(ROUTER.LOGIN);

      if (!isLoginPage) {
        deleteCookie("new-vision-token");
        useAuthStore.getState().clearUser();

        // Show toast notification
        showErrorToast(
          "Errors.Authentication.Title",
          "Errors.Authentication.SessionExpired"
        );

        if (typeof window !== "undefined") {
          window.location.href = ROUTER.LOGIN;
        }
      } else {
        // Dispatch error event for login page components to handle
        dispatchErrorEvent(status, errorMessageKey || "Errors.Authentication.GenericError");
      }
    }

    console.log("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
