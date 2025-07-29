import { useQuery } from "@tanstack/react-query";
import type { Recipe } from '../interfaces/Recipe';
import { API_URL } from '../config';
import { useAuth } from 'react-oidc-context';

export const getRecipesKey = () => ["recipes"];

export const useGetRecipes = () => {
  const auth = useAuth();
  return useQuery<Recipe[], Error>({
    queryKey: getRecipesKey(),
    queryFn: async () => {
      const response = await fetch(`${API_URL}/recipes`, {
        headers: {
          Authorization: `Bearer ${auth.user?.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recipes");
      }
      return response.json();
    },
  });
};
