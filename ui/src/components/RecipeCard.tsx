import { Box, Image, Text, Badge, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const URL = import.meta.env.VITE_IMAGE_BUCKET_URL;

interface RecipeCardProps {
  id: string;
  name: string;
  imageUrl: string;
  tags: string[];
}

function RecipeCard({ id, name, imageUrl, tags }: RecipeCardProps) {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Link to={`/recipes/${id}`}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={cardBg}
        _hover={{ transform: "scale(1.02)", transition: "0.2s" }}
        transition="0.2s"
        cursor="pointer"
      >
        <Image
          src={`${URL}/${imageUrl}`}
          alt={name}
          objectFit="cover"
          height="200px"
          width="100%"
        />

        <Box p="6">
          <Text
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            color={textColor}
          >
            {name}
          </Text>

          <Box mt={3}>
            {tags?.map((tag) => (
              <Badge
                key={tag}
                borderRadius="full"
                px="2"
                colorScheme="teal"
                mr={1}
              >
                {tag}
              </Badge>
            ))}
          </Box>
        </Box>
      </Box>
    </Link>
  );
}

export default RecipeCard;
