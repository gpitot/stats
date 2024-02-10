import { supabase } from "api/database";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const useSearchStatTypes = (query: string) => {
  return useQuery({
    queryKey: ["stats", query],
    enabled: query.length > 1,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stats")
        .select("id, name")
        .like("name", `%${query}%`)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useAddNewStatType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("stats")
        .insert({ name })
        .select("id")
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("stats");
    },
  });
};

export const useGetUserStats = () => {
  return useQuery({
    queryKey: "user_stats",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_stats")
        .select("created_at, units, notes, stats(name)")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useAddUserStat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      stat_id: number;
      units: number;
      notes?: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not logged in");
      }
      await supabase.from("users_stats").insert({
        ...data,
        user_id: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user_stats"]);
    },
  });
};
