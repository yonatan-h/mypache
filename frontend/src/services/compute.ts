import { apiClient } from "@/lib/axios";
import { errorToast } from "@/lib/error-toast";
import { Runtime } from "@/types/compute";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

const WORKERS = "workers";

export function useGetRuntimes() {
  return useQuery<Runtime[], AxiosError>({
    queryKey: [WORKERS, "runtimes"],
    queryFn: async () => {
      const response = await apiClient.get<{ runtimes: Runtime[] }>(
        "/workers/runtimes"
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
