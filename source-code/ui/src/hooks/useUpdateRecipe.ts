import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import type { RecipeFormInputs } from "../components/RecipeForm";
import { getRecipesKey } from "./useGetRecipes";
import { getRecipeKey } from "./useGetRecipe";
import { API_URL } from "../config";
import { useAuth } from "react-oidc-context";

interface UpdateRecipeArgs {
  id: string;
  data: RecipeFormInputs;
}

const updateRecipe = async (
  { id, data }: UpdateRecipeArgs,
  accessToken: string
) => {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update recipe");
  }

  return response.json();
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const auth = useAuth();

  return useMutation<void, Error, UpdateRecipeArgs>({
    mutationFn: (data: UpdateRecipeArgs) =>
      updateRecipe(data, auth.user?.access_token as string),
    onSuccess: (_, { id }) => {
      toast({
        title: "Recipe saved",
        description: "Your recipe has been updated!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: getRecipesKey() });
      queryClient.invalidateQueries({ queryKey: getRecipeKey(id) });
    },
    onError: (error) => {
      console.error("Error updating recipe:", error);
      toast({
        title: "Recipe Update Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    },
  });
};
