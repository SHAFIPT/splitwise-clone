import axiosInstance from "../axiosInstance";

export type UpdateProfilePayload = {
  name: string;
  phone: string;
  location: string;
};

export type ProfileResponse = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatarUrl?: string;
};

export const uploadAvatarApi = async (
  file: File
): Promise<{ avatarUrl: string }> => {
  const formData = new FormData();
    formData.append("avatar", file);

    console.log("Uploading avatar file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    
  const response = await axiosInstance.post<{ avatarUrl: string }>(
    "/profile/upload-avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data; 
};

export const updateProfileApi = async (
  data: UpdateProfilePayload
): Promise<ProfileResponse> => {
    console.log("Updating profile with data:", data);
  const response = await axiosInstance.put<ProfileResponse>(
    "/profile/update",
    data
  );
  return response.data;
};
