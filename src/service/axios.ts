import axios from "axios";

// Base API URL (Change if needed)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create Axios instance
const apiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Ensures cookies are sent if using sessions
});

// Request Interceptor: Attach token
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 errors (Unauthorized)
apiService.interceptors.response.use(
  (response) => response, // Return response if successful
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized: Redirecting to login...");
      localStorage.removeItem("token"); // Remove token on auth failure
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default apiService;
