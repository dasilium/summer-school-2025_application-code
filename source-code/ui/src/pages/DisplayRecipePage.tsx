import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Flex,
} from "@chakra-ui/react";
import type { Recipe } from "../interfaces/Recipe";
import RecipeDetail from "../components/RecipeDetail";
import { useCreateRecipe } from "../hooks/useCreateRecipe";
import { useDeleteRecipe } from "../hooks/useDeleteRecipe";
import { API_URL } from '../config';

const fetchRecipeById = async (id: string) => {
  const response = await fetch(`${API_URL}/recipes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch recipe.");
  }
  return response.json();
};

export default function DisplayRecipePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const createRecipe = useCreateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const {
    data: recipe,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: (): Promise<Recipe> => fetchRecipeById(id!),
  });

  const handleDuplicateRecipe = (data: Recipe) => {
    createRecipe.mutate(
      {
        ...data,
        name: `Copy of ${data.name}`,
      },
      {
        onSuccess: ({ id }) => {
          navigate(`/recipes/${id}`);
        },
      }
    );
  };

  const handleEditRecipe = (recipeId: string) => {
    navigate(`/recipes/${recipeId}/edit`);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    deleteRecipe.mutate(recipeId);
  };

  if (isLoading) {
    return (
      <Container py={8} maxW="6xl">
        <Skeleton height="400px" width="100%" borderRadius="md" />
        <Flex mt={8} gap={8} alignItems="flex-start">
          <Skeleton flex="1" height="200px" borderRadius="md" />
          <Skeleton flex="1" height="300px" borderRadius="md" />
        </Flex>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container py={8} maxW="6xl">
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Failed to load recipe
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            There was an error processing your request. Please try again.
          </AlertDescription>
          <Button mt={4} colorScheme="red" onClick={() => refetch()}>
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!recipe) return null;

  return (
    <RecipeDetail
      recipe={recipe}
      onEdit={handleEditRecipe}
      onDelete={handleDeleteRecipe}
      onDuplicate={handleDuplicateRecipe}
    />
  );
}
