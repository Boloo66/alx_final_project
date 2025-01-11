import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import axios from "axios";

const Shipping = () => {
  const { total, orderItems } = useSelector(
    (state: TRootState) => state.cartReducer
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!total || isNaN(Number(total))) {
      alert("Invalid total amount");
      return;
    }

    dispatch(saveShippingInfo(shippingInfo));

    const auth = localStorage.getItem("auth");
    const token = auth ? JSON.parse(auth.replace(/\s+/g, "")).token : null;

    if (!token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payments/intent`,
        { amount: Number(total) },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard/user/pay", {
        state: { clientSecret: data.data.clientSecret },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (orderItems.length === 0) navigate("/cart");
  }, [orderItems, navigate]);

  return (
    <div>
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <button className="back-btn" onClick={() => navigate("/cart")}>
            Back
          </button>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-600"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                required
                name="address"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your address"
                value={shippingInfo.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-600"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your city"
                value={shippingInfo.city}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-600"
              >
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your state"
                value={shippingInfo.state}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-600"
              >
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your country"
                value={shippingInfo.country}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="zip"
                className="block text-sm font-medium text-gray-600"
              >
                Zipcode
              </label>
              <input
                type="text"
                name="zip"
                id="zip"
                className="mt-1 p-2 w-full border rounded-md"
                placeholder="Enter your zipcode"
                value={shippingInfo.zip}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="p-3 mt-1 bg-blue-600 text-white focus:outline-none rounded"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
