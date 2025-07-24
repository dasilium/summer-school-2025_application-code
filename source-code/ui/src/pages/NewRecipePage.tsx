import RecipeForm, { type RecipeFormInputs } from "../components/RecipeForm";
import { useCreateRecipe } from "../hooks/useCreateRecipe";
import { useNavigate } from "react-router-dom";

export default function NewRecipePage() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateRecipe();

  const handleSubmit = (data: RecipeFormInputs) => {
    console.log({data})
    mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <RecipeForm
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      formTitle="Create a New Recipe"
    />
  );
}
