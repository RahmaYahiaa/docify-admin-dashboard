import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDoctors,
  getDoctor,
  approveDoctor,
  rejectDoctor,
} from "@/services/doctors.service";
import { toast } from "sonner";

export const useDoctors = (params = {}) => {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: async () => {
      const res = await getDoctors(params);
      return res.data;
    },
  });
};

export const useDoctor = (id) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const res = await getDoctor(id);
      return res.data.data ?? res.data;
    },
    enabled: !!id,
  });
};

export const useApproveDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => approveDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor approved successfully!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to approve doctor"),
  });
};

export const useRejectDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => rejectDoctor(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast.success("Doctor rejected successfully!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to reject doctor"),
  });
};
