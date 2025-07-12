import { useMutation } from "@tanstack/react-query";
import { updateProfileApi } from "@/lib/api/profile-api";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";

export const useUpdateProfile = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (data) => {
      dispatch(setUser(data));
      toast.success("Profile updated successfully ✅");
    },
    onError: (err) => {
      console.error("Profile update failed:", err);
      toast.error("Profile update failed. Please try again.");
    },
  });
};
