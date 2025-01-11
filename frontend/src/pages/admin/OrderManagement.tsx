import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from "../../redux/api/adminAPI";

const OrderManagementPage = () => {
  const { id } = useParams(); // Get order ID from URL params
  const navigate = useNavigate();
  console.log(id);

  // Mutations
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();
  // State to handle order status updates
  const [status, setStatus] = useState<string>("");

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder({ id: id! }).unwrap();
      console.log("Order deleted successfully!");
      navigate("/dashboard/admin/orders");
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Error deleting order.");
    }
  };

  // Handle status update
  const handleUpdateStatus = async () => {
    if (!status.trim()) {
      alert("Please enter a valid status");
      return;
    }

    try {
      const res = await updateOrder({
        id: id!,
        data: { status },
      }).unwrap();
      console.log(res);

      if (res.status === "success") {
        alert("Order status updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update order:", error);
      alert("Error updating order.");
    }
  };

  // Navigate back to orders page
  const handleBack = () => navigate("/dashboard/admin/orders");

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Manage Order #{id}
      </h1>

      <div className="space-y-4">
        {/* Status Update */}
        <div>
          <label htmlFor="status" className="block font-medium text-gray-700">
            Update Order Status:
          </label>
          <input
            type="text"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter new status (e.g., Shipped, Delivered)"
          />
          <button
            onClick={handleUpdateStatus}
            disabled={isUpdating}
            className={`mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              isUpdating && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </button>
        </div>

        {/* Delete Order */}
        <button
          onClick={handleDeleteOrder}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Delete Order
        </button>

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mt-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default OrderManagementPage;
