import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import type { RecipeFormInputs } from "../components/RecipeForm";
import { getRecipesKey } from "./useGetRecipes";
import { API_URL } from '../config';

const getPresignedUrl = async (fileName: string, fileType: string) => {
  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileName, fileType }),
  });

  if (!response.ok) {
    throw new Error("Failed to get pre-signed URL");
  }

  return response.json();
};

const uploadImage = async (file: File): Promise<string> => {
  const { uploadUrl, key } = await getPresignedUrl(
    file.name,
    file.type
  );

  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return key;
};

const createRecipe = async (data: RecipeFormInputs) => {
  let imageUrl = data.imageUrl ?? null;

  if (data.heroImageFile && data.heroImageFile.length > 0) {
    const file = data.heroImageFile[0];
    imageUrl = await uploadImage(file);
  }

  const response = await fetch(`${API_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data, imageUrl }),
  });

  if (!response.ok) {
    throw new Error("Failed to create recipe");
  }

  return response.json();
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      toast({
        title: "Recipe published!",
        description: "Your new recipe is now live.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      queryClient.invalidateQueries({ queryKey: getRecipesKey() });
    },
    onError: (error) => {
      console.error("Error creating recipe:", error);
      toast({
        title: "Recipe Submission Failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    },
  });
};
