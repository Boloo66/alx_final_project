import React from "react";
import { NavLink } from "react-router-dom";

const AdminMenu = () => {
  return (
    <>
      <div className="p-3 mt-4 mb-2 text-lg font-semibold bg-gray-200 block">
        Admin Links
      </div>

      <ul className="list-none">
        <li>
          <NavLink
            to="/dashboard/admin/createproduct"
            className="block py-2 px-4 transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <span className="font-bold">Create Product</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/admin/products"
            className="block py-2 px-4 transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <span className="font-bold">Products</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/admin/orders"
            className="block py-2 px-4 transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <span className="font-bold">Transactions</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/dashboard/admin/users"
            className="block py-2 px-4 transition duration-300 ease-in-out hover:bg-gray-100"
          >
            <span className="font-bold">Manage Users</span>
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default AdminMenu;
