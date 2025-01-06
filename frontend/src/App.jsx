import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import NavBar from "./components/NavBar";
import Product from "./pages/Product";
import About from "./pages/About";
import Home from "./pages/Home";
import Menu from "./components/nav/Menu";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <nav>
        <Menu />
      </nav>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/product/:productId" element={<Product />}></Route>
        <Route path="/about" element={<About />}></Route>
      </Routes>
    </div>
  );
}

export default App;
