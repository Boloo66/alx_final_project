import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";

const NavBar = () => {
  return (
    <div className="flex justify-between items-center bg-blue-500 w-full z-10 py-5 px-2">
      <div>
        <p className="w-2 sm:w-[100%] font-medium text-gray-100">MY_STORE</p>
      </div>

      <div className="flex-1 mx-[500px]">
        <ul className="flex justify-evenly ">
          <li>
            <NavLink to={"/"}>
              <p className="font-normal text-base text-center text-gray-100">
                HOME
              </p>
              <hr className="border-b w-2/3 border-gray-200 mx-auto h-[1px]" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/about"}>
              <p className="font-normal text-base text-center text-gray-100">
                ABOUT
              </p>
              <hr className="border-b w-2/3 h-[1px] border-gray-200 mx-auto" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/product"}>
              <p className="font-normal text-base text-center text-gray-100">
                PRODUCT
              </p>
              <hr className="border-b w-1/3 h-[1px] border-gray-200 mx-auto" />
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex items-center space-x-4">
        <img src={assets.cart_icon} className="w-5 " alt="Cart" />
        <img src={assets.profile_icon} className="w-5 " alt="Profile" />
      </div>
      <div>
        <button className="bg-inherit px-5 py-1 text-gray-100 font-medium ">
          Register
        </button>
        <button className="bg-inherit px-5 py-2 text-gray-100 font-medium">
          Login
        </button>
      </div>
    </div>
  );
};

export default NavBar;
