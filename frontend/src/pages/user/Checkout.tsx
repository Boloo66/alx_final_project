import React, { FormEvent, useState } from "react";
import {
  useStripe,
  Elements,
  PaymentElement,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  OrderResponse,
  useCreateOrderMutation,
} from "../../redux/api/orderAPI";
import useSelection from "antd/es/table/hooks/useSelection";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import { resetCart } from "../../redux/reducer/cartReducer";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { MessageResponse } from "../../types/api-types";
import toast from "react-hot-toast";

const Stripe = loadStripe(`${import.meta.env.VITE_STRIPE_PKEY}`);

const Checkout = () => {
  const {
    shippingfee,
    orderItems,
    subtotal,
    tax,
    discount,
    shippingDetails,
    total,
  } = useSelector((state: TRootState) => state.cartReducer);
  const { user } = useSelector((state: TRootState) => state.userReducer);

  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isprocessing, setIsProcessing] = useState<boolean>(false);

  const [newOrder, { isLoading, isError, error }] = useCreateOrderMutation();

  const handleSubmit = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    setIsProcessing(true);

    const orderData: OrderResponse = {
      shippingfee,
      orderItems,
      subtotal,
      tax,
      discount,
      shippingLocation: shippingDetails,
      total: Number(total),
      userId: user?.id,
    };

    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      console.error("Payment failed:", error);
      return;
    }
    if (paymentIntent.status === "succeeded") {
      setIsProcessing(false);
      const res = await newOrder(orderData);
      if ("data" in res && res.data) {
        dispatch(resetCart());
        console.log(res);
        //responseToast(res, Navigate, "/dashboard/user/orders");
        alert("Payment successful! Your order has been placed.");
        window.location.href = "/orders";
      } else {
        const error = res!.error as unknown as FetchBaseQueryError;
        const errRes = error.data as MessageResponse;
        toast.error(errRes.message!);
      }
    }
    setIsProcessing(false);
  };
  const location = useLocation();
  const clientSecret: string | undefined = location.state;
  if (!clientSecret) return <Navigate to={"/shipping"} />;
  return (
    <div>
      <Elements options={{ clientSecret }} stripe={Stripe}>
        <Checkout />
      </Elements>
    </div>
  );
};

export default Checkout;
