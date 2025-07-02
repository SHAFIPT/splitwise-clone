import { useMutation } from "@tanstack/react-query";
import { verifyOtpApi } from "@/lib/api/auth-api";

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtpApi,
  });
};
