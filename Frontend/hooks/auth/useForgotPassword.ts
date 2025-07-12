
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "@/lib/api/auth-api";
import { toast } from "react-hot-toast";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) =>
      forgotPasswordApi({ email, type: "forgot-password" }),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent to your email ✅");
    },
    onError: (err) => {
      console.error("Failed to send OTP. Please try again.", err);
    },
  });
};
