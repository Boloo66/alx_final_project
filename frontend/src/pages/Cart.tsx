import React, { useEffect, useState } from "react";
import { CartItemCard } from "../components/nav/Cart";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../redux/store";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  OrderItem,
  removeCart,
} from "../redux/reducer/cartReducer";
import axios from "axios";
import { Link } from "react-router-dom";

const Cart = () => {
  const { orderItems, subtotal, tax, total, discount, shippingfee } =
    useSelector((state: TRootState) => state.cartReducer);
  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false);

  const handleIncrement = (orderItem: OrderItem) => {
    if (orderItem.quantity >= orderItem.stock!) {
      return; // Prevent incrementing beyond stock
    }
    dispatch(addToCart({ ...orderItem, quantity: orderItem.quantity + 1 }));
  };

  const handleDecrement = (orderItem: OrderItem) => {
    if (orderItem.quantity <= 1) return;
    dispatch(addToCart({ ...orderItem, quantity: orderItem.quantity - 1 }));
  };

  const handleRemoveItem = (orderItem: OrderItem) => {
    dispatch(removeCart(orderItem));
  };

  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();

    const timeOutID = setTimeout(() => {
      axios
        .get(
          `${import.meta.env.VITE_SERVER}/api/v1/coupons/confirm-code?code=${couponCode}`,
          { cancelToken }
        )
        .then((res) => {
          const amt = res.data.data.coupon.discount;
          dispatch(discountApplied(amt)); // Apply discount if valid
          setIsValidCoupon(true);
        })
        .catch(() => {
          dispatch(discountApplied(0)); // Reset discount on error
          setIsValidCoupon(false);
        })
        .finally(() => {
          dispatch(calculatePrice()); // Recalculate prices after discount
        });
    }, 1000);

    return () => {
      clearTimeout(timeOutID);
      cancel();
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice()); // Recalculate price when items change
  }, [orderItems, dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen pt-10">
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">
        Your Cart
      </h1>

      <div className="mx-auto max-w-6xl px-4 lg:flex lg:space-x-8">
        {/* Cart Items */}
        {orderItems.length > 0 ? (
          orderItems.map((i, idx) => (
            <div className="flex-grow" key={idx}>
              <CartItemCard
                cartItem={i}
                incrementHandler={handleIncrement}
                decrementHandler={handleDecrement}
                removeHandler={handleRemoveItem}
              />
            </div>
          ))
        ) : (
          <div className="text-2xl text-center p-6 rounded-lg bg-white shadow-lg">
            No Items in this cart
          </div>
        )}

        {/* Summary Section */}
        <div className="mt-8 lg:mt-0 lg:w-1/3">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            {/* Subtotal */}
            <div className="flex justify-between mb-4">
              <p className="text-gray-600">Subtotal</p>
              <p className="font-medium text-gray-800">${subtotal}</p>
            </div>
            {/* Shipping Charges */}
            <div className="flex justify-between mb-4">
              <p className="text-gray-600">Shipping Charges</p>
              <p className="font-medium text-gray-800">${shippingfee}</p>
            </div>
            {/* Tax */}
            <div className="flex justify-between mb-4">
              <p className="text-gray-600">Tax</p>
              <p className="font-medium text-gray-800">${tax}</p>
            </div>
            {/* Discount */}
            <div className="flex justify-between mb-4">
              <p className="text-gray-600">Discount</p>
              <p className="font-medium text-gray-800">
                -${(discount / 100) * subtotal || 0}
              </p>
            </div>
            <hr className="my-4" />
            {/* Total */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800">Total</p>
              <div>
                <p className="text-2xl font-bold text-blue-600">${total}</p>
                <p
                  className="text-smTypeError: Cannot read properties of undefined (reading 'toFixed')
    at Cart (Cart.tsx:118:29)
    at renderWithHooks (react-dom.development.js:15486:18)
    at updateFunctionComponent (react-dom.development.js:19617:20)
    at beginWork (react-dom.development.js:21640:16)
    at beginWork$1 (react-dom.development.js:27465:14)
    at performUnitOfWork (react-dom.development.js:26596:12)
    at workLoopSync (react-dom.development.js:26505:5)
    at renderRootSync (react-dom.development.js:26473:7)
    at recoverFromConcurrentError (react-dom.development.js:25889:20)
    at performSyncWorkOnRoot (react-dom.development.js:26135:20) text-gray-500"
                >
                  Including VAT
                </p>
              </div>
            </div>

            {/* Coupon Input */}
            <div className="mt-6">
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                type="text"
                placeholder="Enter Coupon Code"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {couponCode ? (
                isValidCoupon ? (
                  <p className="mt-2 text-sm text-green-500">
                    Save extra with code <code>{couponCode}</code>
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-red-500">
                    Invalid coupon code
                  </p>
                )
              ) : null}
            </div>

            {orderItems.length > 0 && (
              <Link to="/dashboard/user/shipping">
                {/* Checkout Button */}
                <button className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition">
                  Proceed to Checkout
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
