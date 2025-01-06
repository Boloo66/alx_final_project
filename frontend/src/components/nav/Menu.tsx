import React from "react";
import { NavLink } from "react-router-dom";

const Menu = () => {
  return (
    <nav className="bg-blue-500 p-4 w-full z-10 pb-5">
      <div className=" container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-white text-lg font-semibold uppercase">
          Home
        </NavLink>
        <div className="space-x-4 flex items-center">
          <NavLink to="/shop" className="text-white hover:text-gray-300">
            <p className="text-xl">Shop</p>
          </NavLink>
          <div className="relative inline-block pt-2 pr-1">
            <NavLink
              to="/cart"
              className="text-white hover:text-gray-500 relative flex items-center"
            >
              <p className="text-xl text-white">Cart (3)</p>
            </NavLink>
          </div>

          <NavLink
            to="/dashboard/user"
            className="text-white hover:text-gray-300 font-semibold uppercase"
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/user/orders"
            className="text-white hover:text-gray-300 font-semibold uppercase"
          >
            Orders
          </NavLink>
          <span className="cursor-pointer text-white hover:text-gray-300">
            <p className="flex justify-start">Hello John</p>
            <p className="text-xl">Logout</p>
          </span>

          <NavLink
            to="/register"
            className="text-white hover:text-gray-300 font-semibold uppercase"
          >
            Register
          </NavLink>
          <NavLink
            to="/login"
            className="text-white hover:text-gray-300 font-semibold uppercase"
          >
            Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
