import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout, userExist } from "./redux/reducer/userReducer";
import { useEffect } from "react";

import About from "./pages/About";
import Home from "./pages/Home";
import Menu from "./components/nav/Menu";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Register from "./pages/auth/Register";
import PrivateRoutes from "./components/routes/PrivateRoutes";
import UserDashboard from "./pages/user/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminRoute from "./components/routes/AdminRoute";
import CreateProduct from "./pages/admin/CreateProduct";
import AdminProduct from "./pages/admin/Product";
import Login from "./pages/auth/Login";
import AdminProducts from "./pages/admin/Products";
import Shipping from "./pages/Shipping";
import Checkout from "./pages/user/Checkout";
import Order from "./pages/user/Order";
import Transaction from "./pages/admin/Transaction";
import OrderManagementPage from "./pages/admin/OrderManagement";

function App() {
  const dispatch = useDispatch();

  // Retrieve the user data from localStorage
  const userString = localStorage.getItem("auth");
  const { user } = userString ? JSON.parse(userString) : null;
  const token = user ? user.token : null;

  // Dispatch the appropriate action based on the user's authentication state
  useEffect(() => {
    if (user) {
      dispatch(userExist({ user }));
    } else {
      dispatch(logout());
    }
  }, [dispatch, user, token]);

  return (
    <>
      <nav>
        <Menu />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#4CAF50", color: "#FFF" },
            duration: 5000,
          }}
        />
      </nav>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private Routes */}
        <Route path="/dashboard" element={<PrivateRoutes />}>
          <Route path="user" element={<UserDashboard />} />
          <Route path="user/shipping" element={<Shipping />} />
          <Route path="user/pay" element={<Checkout />} />
          <Route path="user/orders" element={<Order />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/createproduct" element={<CreateProduct />} />
          <Route path="admin/orders" element={<Transaction />} />

          <Route path="admin/product/:id" element={<AdminProduct />} />
          <Route
            path="admin/transaction/:id"
            element={<OrderManagementPage />}
          />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-4xl font-bold">404 Not Found</h1>
            </div>
          }
        />
      </Routes>
    </>
  );
}

export default App;
