import { apiClient } from "@/lib/axios";
import { errorToast } from "@/lib/error-toast";
import { CreateNotebook, Notebook } from "@/types/notebook";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

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
