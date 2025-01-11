import React from "react";
import { useMyOrdersQuery } from "../../redux/api/orderAPI";
import { useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FaEye } from "react-icons/fa"; // Eye icon for navigation
import { useMyAdminOrdersQuery } from "../../redux/api/adminAPI";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const Transaction = () => {
  const { data, isError, error, isLoading } = useMyAdminOrdersQuery({});

  // Function to extract the error message safely
  const getErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object" && "data" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        return (fetchError.data as { message: string }).message;
      }
    }
    return "An error occurred";
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-blue-700 mb-6">
        Your Orders
      </h1>

      {isLoading && (
        <p className="text-center text-gray-500">Loading orders...</p>
      )}

      {isError && (
        <p className="text-center text-red-500">
          Error: {getErrorMessage(error)}
        </p>
      )}

      {data && data.data.orders.length === 0 && (
        <p className="text-center text-gray-600">No orders found.</p>
      )}

      {data && data.data.orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-gray-700">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Product Image</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Discount</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.data.orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-blue-100">
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.status}</td>

                  <td className="px-6 py-4">
                    {order.orderItems.map((item) => (
                      <img
                        key={item.productId}
                        src={item.image || assets.exchange_icon} // Assuming imageUrl is available
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    {order.orderItems.map((item) => (
                      <div key={item.productId}>{item.name}</div>
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    {order.orderItems.map((item) => (
                      <div key={item.productId}>{item.quantity}</div>
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    {order.orderItems.map((item) => (
                      <div key={item.productId}>${item.price}</div>
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    {order.orderItems.map((item) => (
                      <div key={item.productId}>
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    ))}
                  </td>

                  <td className="px-6 py-4">
                    <div key={order.id}>
                      {order.discount ? `${order.discount}%` : "No discount"}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-blue-600 cursor-pointer">
                    <Link to={`/dashboard/admin/transaction/${order.id}`}>
                      <FaEye />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Transaction;
