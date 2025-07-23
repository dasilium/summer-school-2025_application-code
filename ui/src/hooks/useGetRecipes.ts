import { useQuery } from "@tanstack/react-query";
import type { Recipe } from '../interfaces/Recipe';

const API_URL = import.meta.env.VITE_API_URL;

export const getRecipesKey = () => ["recipes"];

export const useGetRecipes = () => {
  return useQuery<Recipe[], Error>({
    queryKey: getRecipesKey(),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/recipes`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json();
    },
  });
};
