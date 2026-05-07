import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  activateSpecialty,
  disableSpecialty,
} from "@/services/specialties.service";
import { toast } from "sonner";

export const useSpecialties = () => {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      const res = await getSpecialties();

      const raw = res.data?.data;

      const list = raw?.specialties || [];

      const transformed = list.map((item) => ({
        id: item.specialty.id,
        name: item.specialty.name,
        description: item.description,
        status: item.status,
        doctors_count: item.doctors_count,
        icon_url:
          item.specialty.icon_url || "/images/default-specialization.png",
      }));

      return {
        specialties: transformed,
        stats: raw?.stats || {},
      };
    },
  });
};

export const useCreateSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createSpecialty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create specialty");
    },
  });
};

export const useUpdateSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSpecialty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update specialty");
    },
  });
};

export const useActivateSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => activateSpecialty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      toast.success("Specialty activated successfully!");
    },
    onError: () => toast.error("Failed to activate specialty"),
  });
};

export const useDisableSpecialty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => disableSpecialty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialties"] });
      toast.success("Specialty disabled successfully!");
    },
    onError: () => toast.error("Failed to disable specialty"),
  });
};
