import { useQuery } from "@tanstack/react-query";
import { getSpecializations } from "@/services/specializations.service";

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["specializations-list"],
    queryFn: async () => {
      const res = await getSpecializations();
      const raw = res.data;
      if (Array.isArray(raw?.data?.data)) return raw.data.data;
      if (Array.isArray(raw?.data)) return raw.data;
      if (Array.isArray(raw)) return raw;
      return [];
    },
    staleTime: 5 * 60 * 1000, // cache 5 min – specializations rarely change
  });
};

