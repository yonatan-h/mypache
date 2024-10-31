import { apiClient } from "@/lib/axios";
import { errorToast } from "@/lib/error-toast";
import { CreateCluster, Runtime } from "@/types/compute";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const WORKERS = "workers";

export function useGetRuntimes() {
  return useQuery<Runtime[], AxiosError>({
    queryKey: [WORKERS, "runtimes"],
    queryFn: async () => {
      const response = await apiClient.get<{ runtimes: Runtime[] }>(
        "/clusters/runtimes"
      );

      return response.data.runtimes;
    },
    onError: errorToast,
  });
}

export function useGetWorkersRatio() {
  return useQuery<{ busy: number; idle: number }, AxiosError>({
    queryKey: [WORKERS, "ratio"],
    queryFn: async () => {
      const response = await apiClient.get<{ busy: number; idle: number }>(
        "/workers/ratio"
      );

      return response.data;
    },
    onError: errorToast,
  });
}

export function useCreateCluster() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, CreateCluster>({
    mutationFn: async ({ name, runtimeId, workers }) => {
      await apiClient.post("/clusters", { name, runtimeId, workers });
    },
    onError: errorToast,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [WORKERS, "ratio"] });
    },
  });
}
