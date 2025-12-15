import { axiosClient } from "@/lib/axios-client";
import { SignupSchemaType } from "@/zod/auth-schema";
import { useMutation, useQuery } from "@tanstack/react-query";

// ===============================|| SIGN UP ||============================== //
const useCreateUser = () => {
  const createUserMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      return axiosClient.post("/auth/register", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
  });
  return { createUserMutation };
};

// ===============================|| USER PROFILE ||============================== //
const useShowUserProfile = () => {
  const showUserProfileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/user/profile/");
      return data;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
  return { showUserProfileQuery };
};

export { useCreateUser, useShowUserProfile };
