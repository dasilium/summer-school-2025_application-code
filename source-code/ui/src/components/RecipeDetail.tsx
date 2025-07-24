import {
  Container,
  Heading,
  Card,
  Tag,
  HStack,
  VStack,
  Text,
  Grid,
  GridItem,
  OrderedList,
  ListItem,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import type { Recipe } from "../interfaces/Recipe";
import { Fragment, useRef } from "react";
import { IMAGE_BUCKET_URL } from "../config";

interface RecipeDetailProps {
  recipe: Recipe;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (data: Recipe) => void;
}

export default function RecipeDetail({
  recipe,
  onEdit,
  onDelete,
  onDuplicate,
}: RecipeDetailProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Container py={8} maxW="6xl">
      <VStack spacing={4} display="flex" align="stretch" mt={8}>
        <Image
          src={`${IMAGE_BUCKET_URL}/${recipe.imageUrl}`}
          alt={recipe.name}
          objectFit="cover"
          backgroundAttachment="fixed"
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          maxHeight={400}
        />
        {recipe.imageUrl ? (
          <Image
            src={`${IMAGE_BUCKET_URL}/${recipe.imageUrl}`}
            alt={recipe.name}
            objectFit="cover"
            backgroundAttachment="fixed"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            maxHeight={400}
          />
        ) : (
          <Image
            src={"recipe-placeholder-featured.jpg"}
            alt={recipe.name}
            objectFit="cover"
            backgroundAttachment="fixed"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            maxHeight={400}
            fallback={<Skeleton width="100%" height="200px"></Skeleton>}
            fallbackStrategy="beforeLoadOrError"
          />
        )}
        <Heading as="h1" size="2xl">
          {recipe.name}
        </Heading>

        <HStack flex={1} spacing={4} align="center" justify="space-between">
          <HStack spacing={4} align="center">
            <Text color="gray.500">
              {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
            <HStack spacing={2}>
              {recipe.tags?.map((diet: string) => (
                <Tag key={diet} colorScheme="green">
                  {diet}
                </Tag>
              ))}
            </HStack>
          </HStack>
          <HStack>
            <Button
              variant="solid"
              colorScheme="teal"
              onClick={() => onDuplicate(recipe)}
            >
              Duplicate
            </Button>
            <Button
              variant="solid"
              colorScheme="teal"
              onClick={() => onEdit(recipe.id)}
            >
              Edit
            </Button>
            <Button variant="outline" colorScheme="red" onClick={onOpen}>
              Delete
            </Button>
          </HStack>
        </HStack>
      </VStack>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={8}
        mt={8}
      >
        <GridItem>
          <Card p={6}>
            <Heading size="lg" mb={4}>
              Ingredients
            </Heading>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
              {recipe.ingredients?.map(
                (ing: { quantity: string; name: string }, index: number) => (
                  <Fragment key={index}>
                    <GridItem>
                      <Text fontWeight="bold">{ing.quantity}</Text>
                    </GridItem>
                    <GridItem>
                      <Text>{ing.name}</Text>
                    </GridItem>
                  </Fragment>
                )
              )}
            </Grid>
          </Card>
        </GridItem>
        <GridItem>
          <Card p={6}>
            <Heading size="lg" mb={4}>
              Preparation
            </Heading>
            <OrderedList spacing={3}>
              {recipe.steps?.map(({ text }, index: number) => (
                <ListItem key={index}>{text}</ListItem>
              ))}
            </OrderedList>
          </Card>
        </GridItem>
        {recipe.notes && (
          <GridItem>
            <Card p={6}>
              <Heading size="lg" mb={4}>
                Notes
              </Heading>
              <Text whiteSpace="pre-wrap">{recipe.notes}</Text>
            </Card>
          </GridItem>
        )}
      </Grid>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Recipe
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onDelete(recipe.id);
                  onClose();
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}
