import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const specializationApi = axios.create({
  baseURL: `${import.meta.env.VITE_SPECIALIZATION_BASE_URL}`,
  headers: { Accept: "application/json" },
});

specializationApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getSpecializations = () => specializationApi.get("/specializations/dropdown");
