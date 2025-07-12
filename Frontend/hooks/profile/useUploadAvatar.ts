import { useMutation } from "@tanstack/react-query";
import { uploadAvatarApi } from "@/lib/api/profile-api";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";
import { User } from "@/types/User";

export const useUploadAvatar = (user: User) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: uploadAvatarApi,
    onSuccess: (data) => {
      console.log('This is the sucess data :',data)
      dispatch(setUser({ ...user, avatarUrl: data.avatarUrl }));
      toast.success("Avatar uploaded successfully ✅");
    },
    onError: (err) => {
      console.error("Avatar upload failed:", err);
      toast.error("Avatar upload failed. Please try again.");
    },
  });
};
