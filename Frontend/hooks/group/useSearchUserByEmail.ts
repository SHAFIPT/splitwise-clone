import { searchUserByEmailApi } from "@/lib/api/group-api";
import { useQuery } from "@tanstack/react-query";

export const useSearchUserByEmail = (email: string) => {
  return useQuery({
    queryKey: ["search-user", email],
    queryFn: () => searchUserByEmailApi(email),
    enabled: !!email, 
    staleTime: 1000 * 60, 
    retry: false
  });
};
