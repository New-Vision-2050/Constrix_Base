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
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vY29yZS1iZS1wcjE2LmNvbnN0cml4LW52LmNvbS9hcGkvdjEvYXV0aHMvbG9naW4tc3RlcCIsImlhdCI6MTc0MTU0ODgyMSwiZXhwIjoxNzQxNjM1MjIxLCJuYmYiOjE3NDE1NDg4MjEsImp0aSI6IlJzZmxCTUhCa3R2SjRwYjciLCJzdWIiOiJiZjljZDFjZi0wMTM1LTQ3OTYtYjY4Zi0xYjI0OGVjYTYzNzkiLCJwcnYiOiJiYjY1ZDliOGZiZjBkYTk4MjdjOGVkMjMxZDljNTRjODE3ZjBmYmIyIn0.XlS89F_6PWu6KcxQfJnZkReapfnfOfXyAEcvXuVxN6o";
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
    console.log("API Error:", error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);
