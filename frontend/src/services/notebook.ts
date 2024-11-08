import { apiClient } from "@/lib/axios";
import { errorToast } from "@/lib/error-toast";
import {
  CreateNotebook,
  Notebook,
  RetrievedCell,
  RetrievedNotebook,
} from "@/types/notebook";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const NOTEBOOKS = "notebooks";

export function useCreateNotebook() {
  const client = useQueryClient();
  return useMutation<Notebook, AxiosError, CreateNotebook>({
    mutationFn: async (data) => {
      const res = await apiClient.post<{ notebook: Notebook }>(
        "/notebooks",
        data
      );
      return res.data.notebook;
    },
    onError: errorToast,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [NOTEBOOKS] });
    },
  });
}

export function useGetNotebook(id: string) {
  return useQuery<RetrievedNotebook, AxiosError>({
    queryKey: [NOTEBOOKS, id],
    queryFn: async () => {
      const res = await apiClient.get<{ notebook: RetrievedNotebook }>(
        `/notebooks/${id}`
      );
      return res.data.notebook;
    },
    onError: errorToast,
  });
}

export function useGetNotebooks() {
  return useQuery<RetrievedNotebook[], AxiosError>({
    queryKey: [NOTEBOOKS],
    queryFn: async () => {
      const res = await apiClient.get<{ notebooks: RetrievedNotebook[] }>(
        `/notebooks`
      );
      return res.data.notebooks;
    },
    onError: errorToast,
  });
}

export function useRunNotebook() {
  const client = useQueryClient();
  return useMutation<
    void,
    AxiosError,
    { id: string; cells: RetrievedCell[]; index: number }
  >({
    mutationFn: async ({ id, cells, index }) => {
      console.log("🚀 ~ mutationFn: ~ cells:", cells);
      await apiClient.put(`/notebooks/${id}/run/${index}`, { cells });
    },
    onError: errorToast,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [NOTEBOOKS] });
    },
  });
}
