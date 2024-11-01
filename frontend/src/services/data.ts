import { apiClient } from "@/lib/axios";
import { errorToast } from "@/lib/error-toast";
import { AddSparkFile, SparkFile } from "@/types/data";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const FILES = "files";

export function useUploadSparkFile() {
  const client = useQueryClient();
  return useMutation<void, AxiosError, AddSparkFile>({
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

export function useGetSparkFiles() {
  return useQuery({
    queryKey: [FILES],
    queryFn: async () => {
      const res = await apiClient.get<{ files: SparkFile[] }>("/files");
      return res.data.files;
    },
    onError: errorToast,
  });
}
