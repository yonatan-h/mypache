import { apiClient, getToken, setToken } from "@/lib/axios";
import { errorToast } from "@/lib/error-toast";
import { User } from "@/types/user";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

const USER = "user";

export function useGetMe() {
  return useQuery<User, AxiosError>({
    queryKey: [USER, "me"],
    queryFn: async () => {
      const response = await apiClient.get<{ user: User }>("/users/me");
      return response.data.user;
    },
    onError: errorToast,
    retry: false,
  });
}

export function useLogin() {
  const client = useQueryClient();
  return useMutation<string, AxiosError>({
    mutationFn: async () => {
      const response = await apiClient.post<{ token: string }>(
        "/users/session"
      );
      return response.data.token;
    },
    onError: errorToast,
    onSuccess: (token) => {
      setToken(token);
      client.invalidateQueries(USER);
    },
  });
}

export function blockNoAuth() {
  const navigate = useNavigate();

  return useQuery<boolean, AxiosError>({
    queryKey: [USER, "isLoggedIn"],
    queryFn: async () => {
      if (!getToken()) {
        return false;
      }

      await apiClient.get<User>("/users/me");
      return true;
    },
    onSuccess: (isLoggedIn) => {
      if (!isLoggedIn) {
        navigate("/");
      }
    },
    onError: () => {
      navigate("/");
    },
    retry: false,
  });
}
