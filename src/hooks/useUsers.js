import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  getUserReasons,
  suspendUser,
  activateUser,
  createDoctor,
  createAdmin,
  updateUser,
} from "@/services/users.service";
import { toast } from "sonner";

export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const res = await getUsers(params);
      return res.data;
    },
  });
};

export const useUserReasons = () => {
  return useQuery({
    queryKey: ["user-reasons"],
    queryFn: async () => {
      const res = await getUserReasons();
      return res.data;
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => suspendUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User suspended successfully");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to suspend user"),
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => activateUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User activated successfully");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to activate user"),
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Doctor created successfully!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create doctor"),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Admin created successfully!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to create admin"),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated successfully!");
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || "Failed to update user"),
  });
};
