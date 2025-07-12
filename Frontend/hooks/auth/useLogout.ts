import { useMutation } from "@tanstack/react-query";
import { logoutApi } from "@/lib/api/auth-api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userSlice";
import { removeAccessToken } from "@/lib/utils/tokenUtils";
import { toast } from "react-hot-toast";

export const useLogout = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      dispatch(logout());
      removeAccessToken();
      toast.success("Logged out successfully ✅");
      router.push("/login");
    },
    onError: (err) => {
      console.error("Logout failed:", err);
      toast.error("Logout failed. Please try again.");
    },
  });
};
