import { Routes, Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import NewRecipePage from "./pages/NewRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import DisplayRecipePage from "./pages/DisplayRecipePage";

function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/recipes/new" element={<NewRecipePage />} />
        <Route path="/recipes/:id" element={<DisplayRecipePage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
      </Routes>
    </Box>
  );
}

export default App;
