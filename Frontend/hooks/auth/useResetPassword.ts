import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/lib/api/auth-api";
import { toast } from "react-hot-toast";
import { CustomAxiosError } from "@/app/(auth)/forgot-password/page";

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset successfully ✅");
    },
    onError: (error: CustomAxiosError) => {
      const message = error?.response?.data?.message || error.message || "Reset failed";
      toast.error(message);
    },
  });
};
