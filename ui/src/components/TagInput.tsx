import React, { useState } from "react";
import {
  Box,
  Input,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
} from "@chakra-ui/react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

const TagInput = ({ value, onChange, placeholder }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Box>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      <HStack spacing={2} mt={2} wrap="wrap">
        {value.map((tag) => (
          <Tag
            key={tag}
            size="md"
            borderRadius="full"
            variant="solid"
            colorScheme="teal"
          >
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => handleRemoveTag(tag)} />
          </Tag>
        ))}
      </HStack>
    </Box>
  );
};

export default TagInput;
