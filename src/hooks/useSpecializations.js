import { useQuery } from "@tanstack/react-query";
import { getSpecializations } from "@/services/specializations.service";

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: getSpecializations,
  });
};
