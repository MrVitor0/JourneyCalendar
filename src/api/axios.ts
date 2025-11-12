import axios, { type AxiosInstance, type AxiosError } from "axios";

/**
 * Create axios instance with default configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Add any auth tokens or custom headers here if needed
 */
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle global errors and transform responses
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }

    if (!error.response) {
      console.error("Network error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
