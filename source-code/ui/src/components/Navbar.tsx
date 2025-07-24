import { Box, Flex, Spacer, Button, useColorMode, useColorModeValue, IconButton } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";

function Navbar() {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <Flex bg="teal.500" p={4} color="white" align="center">
      <Box p="2">
        <Link to="/">
          <Button colorScheme="teal" variant="ghost">
            Home
          </Button>
        </Link>
        <Link to="/recipes/new">
          <Button colorScheme="teal" variant="ghost" ml={2}>
            New Recipe
          </Button>
        </Link>
      </Box>
      <Spacer />
      <IconButton
        aria-label="Toggle color mode"
        icon={<SwitchIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        color="white"
      />
    </Flex>
  );
}

export default Navbar;
