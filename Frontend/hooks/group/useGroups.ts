import { useQuery } from "@tanstack/react-query";
import { fetchGroupsApi } from "@/lib/api/group-api";

export const useGroups = (search: string, category: string) => {
  return useQuery({
    queryKey: ["groups", search, category],
    queryFn: () => fetchGroupsApi(search, category),
    staleTime: 1000 * 60 * 5,
  });
};