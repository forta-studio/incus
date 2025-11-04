import axios from "axios";

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const axiosInstance = axios.create({
  baseURL: "/api", // Now points to our Next.js API proxy routes
});

axiosInstance.interceptors.request.use((config) => {
  if (apiKey) {
    config.headers["x-api-key"] = apiKey;
  }
  return config;
});

export default axiosInstance;
