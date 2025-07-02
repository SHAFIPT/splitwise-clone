import { useMutation } from "@tanstack/react-query";
import { registerApi } from "@/lib/api/auth-api";
import { useRouter } from "next/navigation";
import type { RegisterResponse } from "@/types/auth";

export const useRegister = () => {
  const router = useRouter();

  return useMutation<RegisterResponse, Error, { name: string; email: string; password: string }>({
    mutationFn: registerApi,
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (err) => {
      console.error("Registration failed:", err);
    },
  });
};
