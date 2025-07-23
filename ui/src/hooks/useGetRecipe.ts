import { useQuery } from "@tanstack/react-query";
import type { Recipe } from "../interfaces/Recipe";

const API_URL = import.meta.env.VITE_API_URL;

const fetchRecipeById = async (id: string) => {
  const response = await fetch(`${API_URL}/recipes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipe.");
  }
  return response.json();
};

export const getRecipeKey = (id: string) => ["recipes", id];

export const useGetRecipe = (id: string | undefined) => {
  return useQuery<Recipe, Error>({
    queryKey: getRecipeKey(id!),
    queryFn: () => fetchRecipeById(id!),
    enabled: !!id,
  });
};
