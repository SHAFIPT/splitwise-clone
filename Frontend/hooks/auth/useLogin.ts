import { loginApi } from "@/lib/api/auth-api";
import { setAccessToken } from "@/lib/utils/tokenUtils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      router.push("/dashboard"); // or wherever
    },
    onError: (err) => {
      console.error("Login failed:", err);
    },
  });
};
