import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import {
  Container,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  Button,
  HStack,
  Tag,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import TagInput from "./TagInput";

export interface RecipeFormInputs {
  name: string;
  notes?: string;
  heroImageFile?: FileList; // Change to FileList to handle multiple files if needed, or File for single
  tags: string[];
  ingredients: { quantity: string; name: string }[];
  steps: { text: string }[];
}

interface RecipeFormProps {
  initialData?: RecipeFormInputs;
  onSubmit: (data: RecipeFormInputs) => void;
  isSubmitting: boolean;
  formTitle: string;
}

export default function RecipeForm({
  initialData,
  onSubmit,
  isSubmitting,
  formTitle,
}: RecipeFormProps) {
  const [activeStep, setActiveStep] = useState(0);
  const { isOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<RecipeFormInputs>({
    defaultValues: initialData || {
      name: "",
      notes: "",
      tags: [],
      ingredients: [{ quantity: "", name: "" }],
      steps: [{ text: "" }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray<RecipeFormInputs>({
    control,
    name: "steps",
  });

  const watchedFields = watch(); // Watch all fields for dirty state and autosave

  const steps = [
    { title: "Details", description: "name, description, tags" },
    { title: "Ingredients", description: "List of ingredients" },
    { title: "Instructions", description: "Step-by-step guide" },
    { title: "Media", description: "Images, videos, PDFs" },
    { title: "Review & Publish", description: "Final check" },
  ];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Container maxW="960px" py={8}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/recipes">
            Recipes
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{formTitle}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <HStack justifyContent="space-between" alignItems="center" my={4}>
        <Heading as="h1" size="xl">
          {formTitle}
        </Heading>
        {isDirty && (
          <Tag size="lg" colorScheme="orange" variant="solid">
            Unsaved changes
          </Tag>
        )}
      </HStack>

      <Stepper index={activeStep} colorScheme="teal" my={8}>
        {steps.map((step, _index) => (
          <Step key={_index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Box p={4} borderWidth="1px" borderRadius="lg">
        {activeStep === 0 && (
          <VStack spacing={4} align="stretch">
            <FormControl isRequired isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Recipe Name</FormLabel>
              <Input
                id="name"
                {...register("name", { required: "Recipe name is required." })}
                placeholder="e.g., Classic Spaghetti Carbonara"
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.tags}>
              <FormLabel htmlFor="tags">Tags</FormLabel>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add tags (e.g., pasta, dinner, quick)"
                  />
                )}
              />
              <FormErrorMessage>
                {errors.tags && errors.tags.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.notes}>
              <FormLabel htmlFor="notes">Notes (Optional)</FormLabel>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Any additional notes or tips for this recipe."
              />
              <FormErrorMessage>
                {errors.notes && errors.notes.message}
              </FormErrorMessage>
            </FormControl>
          </VStack>
        )}

        {activeStep === 1 && (
          <VStack spacing={4} align="stretch">
            {ingredientFields.map((field, index) => (
              <HStack
                key={field.id}
                as={motion.div}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <FormControl
                  isInvalid={!!errors.ingredients?.[index]?.quantity}
                >
                  <Input
                    placeholder="Quantity (e.g., 2 cups)"
                    {...register(`ingredients.${index}.quantity` as const, {
                      required: "Quantity is required.",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.ingredients?.[index]?.quantity?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.ingredients?.[index]?.name}>
                  <Input
                    placeholder="Ingredient Name (e.g., Flour)"
                    {...register(`ingredients.${index}.name` as const, {
                      required: "Ingredient name is required.",
                    })}
                  />
                  <FormErrorMessage>
                    {errors.ingredients?.[index]?.name?.message}
                  </FormErrorMessage>
                </FormControl>
                <IconButton
                  aria-label="Remove ingredient"
                  icon={<FaTrash />}
                  onClick={() => removeIngredient(index)}
                  colorScheme="red"
                  variant="ghost"
                />
              </HStack>
            ))}
            <Button
              onClick={() => appendIngredient({ quantity: "", name: "" })}
              variant="ghost"
              colorScheme="teal"
              mt={4}
            >
              Add ingredient
            </Button>
          </VStack>
        )}

        {activeStep === 2 && (
          <VStack spacing={4} align="stretch">
            {instructionFields.map((field, index) => (
              <HStack key={field.id} align="flex-start">
                <Text fontSize="lg" fontWeight="bold" mt={2}>
                  {index + 1}.
                </Text>
                <FormControl isInvalid={!!errors.steps?.[index]}>
                  <Textarea
                    {...register(`steps.${index}.text` as const, {
                      required: "Step text is required.",
                    })}
                    placeholder="Enter step instruction"
                    rows={3}
                    minH="unset"
                    overflow="hidden"
                    resize="none"
                  />
                  <FormErrorMessage>
                    {errors.steps?.[index]?.text?.message}
                  </FormErrorMessage>
                </FormControl>
                <IconButton
                  aria-label="Remove step"
                  icon={<FaTrash />}
                  onClick={() => removeInstruction(index)}
                  colorScheme="red"
                  variant="ghost"
                />
                <IconButton
                  aria-label="Add step below"
                  icon={<span>+</span>}
                  onClick={() => appendInstruction({ text: "" })}
                  colorScheme="teal"
                  variant="ghost"
                />
              </HStack>
            ))}
            <Button
              onClick={() => appendInstruction({ text: "" })}
              variant="ghost"
              colorScheme="teal"
              mt={4}
            >
              Add step
            </Button>
          </VStack>
        )}

        {activeStep === 3 && (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.heroImageFile}>
              <FormLabel htmlFor="heroImageFile">Upload Hero Image</FormLabel>
              <Input
                id="heroImageFile"
                type="file"
                accept="image/*"
                {...register("heroImageFile")}
                p={1}
              />
              <FormErrorMessage>
                {errors.heroImageFile && errors.heroImageFile.message}
              </FormErrorMessage>
            </FormControl>

            {watchedFields.heroImageFile?.[0] && (
              <Box mt={4}>
                <Text mb={2}>Image Preview:</Text>
                <Image
                  src={URL.createObjectURL(watchedFields.heroImageFile[0])}
                  alt="Hero Image Preview"
                  maxH="200px"
                  objectFit="contain"
                />
              </Box>
            )}
          </VStack>
        )}

        {activeStep === 4 && (
          <VStack spacing={4} align="stretch">
            <Heading size="md">Review Your Recipe</Heading>
            <Accordion allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Details
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text>
                    <b>Name:</b> {watchedFields.name}
                  </Text>
                  <Text>
                    <b>Hero Image:</b>{" "}
                    {watchedFields.heroImageFile?.[0]?.name || "N/A"}
                  </Text>
                  <Text>
                    <b>Tags:</b> {watchedFields.tags.join(", ") || "N/A"}
                  </Text>
                  <Text>
                    <b>Notes:</b> {watchedFields.notes || "N/A"}
                  </Text>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Ingredients
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {watchedFields.ingredients.length > 0 ? (
                    <VStack align="stretch">
                      {watchedFields.ingredients.map((ing, index) => (
                        <Text key={index}>
                          {ing.quantity} {ing.name}
                        </Text>
                      ))}
                    </VStack>
                  ) : (
                    <Text>No ingredients added.</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box flex="1" textAlign="left">
                      Steps
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  {watchedFields.steps.length > 0 ? (
                    <VStack align="stretch">
                      {watchedFields.steps.map((step, index) => (
                        <Text key={index}>
                          {index + 1}. {step.text}
                        </Text>
                      ))}
                    </VStack>
                  ) : (
                    <Text>No steps added.</Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </VStack>
        )}
      </Box>

      {/* Sticky Footer */}
      <Flex
        justify="end"
        bg="gray.100"
        _dark={{ bg: "gray.700", borderColor: "gray.600" }}
        p={4}
        mt={8}
        align="center"
        gap={4}
      >
        <Button
          as={RouterLink}
          to="/recipes"
          variant="link"
          ml={4}
          colorScheme="gray"
        >
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} colorScheme="teal">
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            colorScheme="teal"
            isDisabled={activeStep === 0 && !watchedFields.name.trim()}
          >
            Next
          </Button>
        )}
        <HStack>
          <Button
            onClick={handleSubmit(onSubmit)}
            colorScheme="teal"
            isLoading={isSubmitting}
            isDisabled={!isDirty}
          >
            Save recipe
          </Button>
        </HStack>
      </Flex>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Recipe Submission Failed
            </AlertDialogHeader>

            <AlertDialogBody>
              There was an error publishing your recipe. Please try again.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
