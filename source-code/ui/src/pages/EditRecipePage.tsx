import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
import RecipeForm, { type RecipeFormInputs } from "../components/RecipeForm";
import { useGetRecipe } from "../hooks/useGetRecipe";
import { useUpdateRecipe } from "../hooks/useUpdateRecipe";

export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: recipe, isLoading, isError, error, refetch } = useGetRecipe(id);

  const { mutate, isPending } = useUpdateRecipe();

  const handleSubmit = (data: RecipeFormInputs) => {
    if (!id) return;
    mutate(
      {
        id,
        data,
      },
      {
        onSuccess: () => {
          navigate(`/recipes/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container maxW="960px" py={8}>
        <Flex justify="center" mt={8}>
          <Spinner size="xl" color="teal.500" />
        </Flex>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxW="960px" py={8}>
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
            Error Loading Recipe!
          </AlertTitle>
          <AlertDescription maxWidth="sm">{error?.message}</AlertDescription>
          <Button onClick={() => refetch()} mt={4} colorScheme="red">
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!recipe) return null;

  const initialFormData: RecipeFormInputs = {
    name: recipe.name,
    notes: recipe.notes || "",
    tags: recipe.tags || [],
    ingredients: recipe.ingredients || [{ quantity: "", name: "" }],
    steps: recipe.steps || [{ text: "" }],
  };

  return (
    <RecipeForm
      initialData={initialFormData}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      formTitle="Edit Recipe"
    />
  );
}
