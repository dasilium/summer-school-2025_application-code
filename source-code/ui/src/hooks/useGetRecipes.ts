import { useQuery } from "@tanstack/react-query";
import type { Recipe } from '../interfaces/Recipe';
import { API_URL } from '../config';

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
