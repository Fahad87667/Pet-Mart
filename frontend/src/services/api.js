import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for handling cookies/sessions
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for handling multipart/form-data
api.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is set for all requests
    config.withCredentials = true;

    // If the request is multipart/form-data, don't set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error);
      return Promise.reject(new Error("Request timed out. Please try again."));
    }

    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);

export default api;
