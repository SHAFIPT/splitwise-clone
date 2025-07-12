import axiosInstance from "../axiosInstance";

export type LoginResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type RegisterResponse = {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type MessageResponse = {
  message: string;
};


export const loginApi = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerApi = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>("/auth/register", data);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async (): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>("/auth/logout");
    console.log('this ithe logout response get fromt bakcinde :',response)
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const sendOtpApi = async (data: {
  email: string;
  type: string;
}): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>("/auth/send-otp", data);
    console.log('This is the response get in backend:', response);
    return response.data;
  } catch (error) {
    console.log('The error', error);
    // Don't use handleApiError here, let the original AxiosError bubble up
    throw error;
  }
};

export const verifyOtpApi = async (data: {
  email: string;
  otp: string;
}): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>("/auth/verify-otp", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordApi = async (data: {
  email: string;
  type: string; 
}): Promise<MessageResponse> => {
  const response = await axiosInstance.post<MessageResponse>(
    "/auth/forgot-password",
    data
  );
  return response.data;
};

export const resetPasswordApi = async (data: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<MessageResponse> => {
  try {
    const response = await axiosInstance.post<MessageResponse>("/auth/reset-password", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
