import axios from "axios";
import { useAuthStore } from "@/store/authStore";

// The specializations endpoint lives under doctor/v1, not admin/v1
const doctorApi = axios.create({
  baseURL: `${import.meta.env.VITE_SPECIALIZATION_BASE_URL}`,
  headers: { Accept: "application/json" },
});

doctorApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getSpecializations = () => doctorApi.get("/specializations");
