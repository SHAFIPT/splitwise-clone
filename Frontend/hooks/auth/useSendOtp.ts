import { useMutation } from "@tanstack/react-query";
import { sendOtpApi } from "@/lib/api/auth-api";
import { toast } from "react-hot-toast";

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtpApi,
    onSuccess: () => toast.success("OTP sent to your email"),
  });
};
