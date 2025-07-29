import { Routes, Route, useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import NewRecipePage from "./pages/NewRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import DisplayRecipePage from "./pages/DisplayRecipePage";
import { useAuth } from "react-oidc-context";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useEffect } from "react";

const withProtection = (Component: () => JSX.Element | null) => () => {
  const auth = useAuth();
  return auth.isAuthenticated ? <Component /> : null;
};

const ProtectedHome = withProtection(Home);
const ProtectedNewRecipePage = withProtection(NewRecipePage);
const ProtectedDisplayRecipePage = withProtection(DisplayRecipePage);
const ProtectedEditRecipePage = withProtection(EditRecipePage);

const RedirectPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  return null;
};

function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedHome />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/recipes/new" element={<ProtectedNewRecipePage />} />
        <Route path="/recipes/:id" element={<ProtectedDisplayRecipePage />} />
        <Route path="/recipes/:id/edit" element={<ProtectedEditRecipePage />} />
      </Routes>
    </Box>
  );
}

export default App;
