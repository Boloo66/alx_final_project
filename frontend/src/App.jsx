import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Product from "./pages/Product";
import About from "./pages/About";
import Home from "./pages/Home";
import Menu from "./components/nav/Menu";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Order from "./pages/Order";

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
        <Route path="/shop" element={<Shop />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/order" element={<Order />}></Route>
        <Route path="*" element={() => <h1>404 Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
