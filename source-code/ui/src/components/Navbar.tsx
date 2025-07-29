import {
  Box,
  Flex,
  Spacer,
  Button,
  useColorMode,
  useColorModeValue,
  IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaSun, FaMoon } from "react-icons/fa";
import { useAuth } from "react-oidc-context";
import { CLIENT_ID, SIGN_OUT_URL, USER_POOL_DOMAIN } from "../config";
// import { CLIENT_ID } from "../config";

function Navbar() {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const auth = useAuth();

  const signOutRedirect = async () => {
    await auth.removeUser();

    const clientId = CLIENT_ID;
    const logoutUri = SIGN_OUT_URL;
    const cognitoDomain = USER_POOL_DOMAIN;

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri as string
    )}`;
  };

  console.log(auth);

  return (
    <Flex bg="teal.500" p={4} color="white" align="center">
      {auth.isAuthenticated ? (
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
      ) : (
        <Box p="2">
          <Button onClick={() => auth.signinRedirect()}>Sign In</Button>
        </Box>
      )}
      <Spacer />
      <IconButton
        aria-label="Toggle color mode"
        icon={<SwitchIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        color="white"
      />
      {auth.isAuthenticated && (
        <Button colorScheme="red" ml={2} onClick={() => signOutRedirect()}>
          Sign Out
        </Button>
      )}
    </Flex>
  );
}

export default Navbar;
