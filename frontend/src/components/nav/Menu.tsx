import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaShoppingCart, FaUser } from "react-icons/fa";
import { Menu as AntMenu, Dropdown, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import { logout } from "../../redux/reducer/userReducer";

const Menu = () => {
  const { user } = useSelector((state: TRootState) => state.userReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderItems = useSelector(
    (state: TRootState) => state.cartReducer.orderItems
  );

  const handleLogout = () => {
    localStorage.removeItem("auth");
    dispatch(logout());
    navigate("/login");
  };

  const userMenu = (
    <AntMenu>
      <AntMenu.Item key="dashboard">
        <NavLink to={`/dashboard/${user?.role === "admin" ? "admin" : "user"}`}>
          Dashboard
        </NavLink>
      </AntMenu.Item>
      <AntMenu.Item key="orders">
        <NavLink to="/dashboard/user/orders">Orders</NavLink>
      </AntMenu.Item>
      <AntMenu.Divider />
      <AntMenu.Item key="logout" onClick={handleLogout}>
        Logout
      </AntMenu.Item>
    </AntMenu>
  );

  return (
    <nav className="bg-blue-600 p-4 w-full z-10 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <NavLink
          to="/"
          className="text-white text-xl font-bold uppercase flex items-center"
        >
          <FaShoppingBag className="mr-2" /> Home
        </NavLink>

        <div className="flex items-center space-x-6">
          <NavLink
            to="/shop"
            className="text-white text-lg hover:text-gray-300 flex items-center"
          >
            <FaShoppingBag className="mr-1" /> Shop
          </NavLink>

          <NavLink
            to="/cart"
            className="text-white text-lg hover:text-gray-300 relative flex items-center"
          >
            <FaShoppingCart className="mr-1" /> Cart({orderItems.length})
          </NavLink>

          {user ? (
            <Dropdown overlay={userMenu} placement="bottomRight" arrow>
              <Button className="flex items-center text-white bg-blue-600 hover:bg-blue-700 border-none">
                <FaUser className="mr-2" /> Hello {user.name || "User"}
              </Button>
            </Dropdown>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/register"
                className="text-white hover:text-gray-300 text-lg uppercase"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="text-white hover:text-gray-300 text-lg uppercase"
              >
                Login
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
