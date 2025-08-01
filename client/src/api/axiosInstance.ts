
import axios, { AxiosError } from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(formatApiError(error));
  }
);

const formatApiError = (
  error: AxiosError
): Error & { type?: string; errors?: any } => {
  const formatted = new Error("Something went wrong") as Error & {
    type?: string;
    errors?: any;
  };

  if (error.response?.data) {
    const data = error.response.data as {
      message?: string;
      type?: string;
      errors?: any;
    };
    formatted.message = data.message || formatted.message;
    formatted.type = data.type;
    if (data.errors) {
      formatted.errors = data.errors;
    }
  } else if (error.request) {
    formatted.message = "No response from server.";
  } else {
    formatted.message = error.message;
  }

  return formatted;
};
