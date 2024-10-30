import axios from "axios";

const TOKEN = "token";
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN) || null;
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN, token);
}

export const apiClient = axios.create({
  baseURL: "http://localhost:5000",
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
