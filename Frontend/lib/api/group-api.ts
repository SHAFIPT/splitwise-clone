import axiosInstance from "../axiosInstance";

export type GroupPayload = {
  name: string;
  description?: string;
  category: string;
  image: string;
  members: string[];
};

export type FoundUserResponse = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

export type Group = {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  createdAt: string;
  members: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  }[];
};

type CreateGroupResponse = {
  message: string;
  groupId: string;
};

export const createGroupApi = async (
  data: GroupPayload
): Promise<CreateGroupResponse> => {
  const response = await axiosInstance.post<CreateGroupResponse>("/groups/create", data);
  return response.data;
};

export const searchUserByEmailApi = async (email: string): Promise<FoundUserResponse> => {
  const response = await axiosInstance.get<FoundUserResponse>(`/users/search?email=${email}`);
  console.log('This is the response :',response)
  return response.data;
};


export const fetchGroupsApi = async (search: string, category: string): Promise<Group[]> => {
  const response = await axiosInstance.get<Group[]>("/groups", {
    params: {
      search,
      category: category !== "all" ? category : undefined,
    },
  });
  return response.data;
};