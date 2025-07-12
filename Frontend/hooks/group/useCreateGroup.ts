import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createGroupApi } from '@/lib/api/group-api';

export const useCreateGroup = () => {
  return useMutation({
    mutationFn: createGroupApi,
    onSuccess: () => {
      toast.success("Group created successfully 🎉");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create group");
    },
  });
};