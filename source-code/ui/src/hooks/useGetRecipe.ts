import { useQuery } from "@tanstack/react-query";
import type { Recipe } from "../interfaces/Recipe";
import { API_URL } from "../config";
import { useAuth } from "react-oidc-context";

const fetchRecipeById = async (id: string, accessToken: string) => {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch recipe.");
  }
  return response.json();
};

export const getRecipeKey = (id: string) => ["recipes", id];

export const useGetRecipe = (id: string | undefined) => {
  const auth = useAuth();
  return useQuery<Recipe, Error>({
    queryKey: getRecipeKey(id!),
    queryFn: () => fetchRecipeById(id!, auth.user?.access_token as string),
    enabled: !!id,
  });
};
