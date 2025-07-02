import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "@/lib/api/auth-api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import { setAccessToken } from "@/lib/utils/tokenUtils";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(logout());
      setAccessToken("");
      router.push("/login");
    },
    onError: (err) => {
      console.error("Logout failed:", err);
    },
  });
};
