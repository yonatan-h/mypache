import axios from "axios";

const TOKEN = "token";
export function getToken(): string | null {
  //Todo: save real token after experimentation
  return "1";
}

export function setToken(token: string): void {
  //Todo: save real token after experimentation
  sessionStorage.setItem(TOKEN, "1");
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
