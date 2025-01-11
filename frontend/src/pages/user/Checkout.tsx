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
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../redux/store";
import { resetCart } from "../../redux/reducer/cartReducer";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Load the Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PKEY as string);

const CheckoutForm: React.FC = () => {
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

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [newOrder] = useCreateOrderMutation();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not initialized.");
      return;
    }

    setIsProcessing(true);

    try {
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
        toast.error(`Payment failed: ${error.message}`);
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const res = await newOrder(orderData);

        if ("data" in res && res.data) {
          dispatch(resetCart());
          toast.success("Payment successful! Your order has been placed.");
          navigate("/dashboard/user/orders");
        } else {
          const apiError = res.error as any;
          toast.error(apiError.data?.message || "Failed to create order.");
        }
      }
    } catch (err) {
      toast.error("An error occurred during payment.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-4 bg-white shadow-md rounded"
    >
      <PaymentElement />
      <button
        type="submit"
        className={`w-full mt-4 p-2 bg-blue-500 text-white rounded ${
          isProcessing ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isProcessing || !stripe || !elements}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Checkout: React.FC = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state?.clientSecret;
  console.log({ clientSecret });

  if (!clientSecret) {
    toast.error("Missing client secret. Redirecting...");
    return <Navigate to="/dashboard/user/shipping" />;
  }

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
