import { loginApi } from "@/lib/api/auth-api";
import { setAccessToken } from "@/lib/utils/tokenUtils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast"; 

export const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);

      dispatch(
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        })
      );

      toast.success("Logged in successfully ✅");
      router.push("/dashboard");
    },
    onError: (err) => {
      console.error("Login failed:", err);
    },
  });
};
