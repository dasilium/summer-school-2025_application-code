import {
  Box,
  Text,
  Button,
  Container,
  Input,
  SimpleGrid,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Flex,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import RecipeCard from "./RecipeCard";
import { useGetRecipes } from "../hooks/useGetRecipes";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const { data: recipes, isLoading, isError, error, refetch } = useGetRecipes();

  const handleTagToggle = (tag: string) => {
    setActiveTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  const filteredRecipes =
    recipes?.filter((recipe) => {
      const matchesSearch =
        recipe.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        searchTerm === "";

      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => recipe.tags.includes(tag));

      return matchesSearch && matchesTags;
    }) || [];

  const handleRetry = () => {
    refetch();
  };

  const tags = useMemo(
    () => Array.from(new Set(recipes?.flatMap((recipe) => recipe.tags) || [])),
    [recipes]
  );

  return (
    <Box>
      <Container maxW="6xl" py={8}>
        <Input
          placeholder="Search recipes..."
          size="lg"
          mb={4}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Tag Filter Bar */}
        <HStack spacing={2} wrap="wrap" mb={8}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              size="lg"
              borderRadius="full"
              variant={activeTags.includes(tag) ? "solid" : "outline"}
              colorScheme={activeTags.includes(tag) ? "teal" : "gray"}
              onClick={() => handleTagToggle(tag)}
              cursor="pointer"
            >
              <TagLabel>{tag}</TagLabel>
              {activeTags.includes(tag) && (
                <TagCloseButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagToggle(tag);
                  }}
                />
              )}
            </Tag>
          ))}
        </HStack>

        {/* Recipe Grid */}
        {isError ? (
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
              Error Loading Recipes!
            </AlertTitle>
            <AlertDescription maxWidth="sm">{error?.message}</AlertDescription>
            <Button onClick={handleRetry} mt={4} colorScheme="red">
              Retry
            </Button>
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </SimpleGrid>
        )}

        {isLoading && (
          <Flex justify="center" mt={8}>
            <Spinner size="xl" color="teal.500" />
          </Flex>
        )}

        {!isLoading && recipes?.length === 0 && (
          <Text textAlign="center" mt={8} color="gray.500">
            No recipes found.
          </Text>
        )}
      </Container>
    </Box>
  );
}

export default Home;
