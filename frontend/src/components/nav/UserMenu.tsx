import React from "react";
import { NavLink } from "react-router-dom";

const UserMenu = () => {
  return (
    <>
      <div className="p-3 mt-4 mb-2 text-lg font-semibold bg-gray-200 block">
        User Links
      </div>

      <ul className="list-none">
        <li>
          <NavLink
            to="/dashboard/user/profile"
            className="block py-2 px-4 transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <span className="font-bold">Profile</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/user/history"
            className="block py-2 px-4 transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <span className="font-bold">Order History</span>
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default UserMenu;
