import { AxiosError } from "axios";
import { toast } from "react-toastify";

export function errorToast(error: AxiosError) {
  const data = error.response?.data as { error?: string; message?: string };
  const msg1: string =
    data?.error ||
    data?.message ||
    error?.status?.toString() ||
    error?.message ||
    "Error";
  console.error(error);
  toast(msg1, { type: "error" });
}
