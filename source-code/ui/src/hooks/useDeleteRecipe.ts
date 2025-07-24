import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config';

const deleteRecipeById = async (id: string) => {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete recipe.");
  }
  return response.json();
};

export const useDeleteRecipe = () => {
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteRecipeById,
    onSuccess: () => {
      toast({
        title: "Recipe deleted.",
        description: "The recipe has been successfully deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Error deleting recipe.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
};
