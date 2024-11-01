import { apiClient } from "@/lib/axios";
import { errorToast } from "@/lib/error-toast";
import { AddFile } from "@/types/data";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "react-query";

const FILES = "files";

export function useUploadFile() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, AddFile>({
    mutationFn: async ({ targetName, file }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetName", targetName);

      await apiClient.post("/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: errorToast,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: [FILES] });
    },
  });
}
