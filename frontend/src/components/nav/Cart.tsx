import { OrderItem } from "../../redux/reducer/cartReducer";

type TCartItemProps = {
  cartItem: OrderItem;
  incrementHandler: (orderItem: OrderItem) => void;
  decrementHandler: (orderItem: OrderItem) => void;
  removeHandler: (orderItem: OrderItem) => void;
};

export const CartItemCard = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: TCartItemProps) => {
  const { productId, name, price, quantity, image } = cartItem;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-white shadow-lg mb-6">
      {/* Product Image */}
      <img
        className="w-24 h-24 object-cover rounded-md border border-gray-200"
        src={image}
        alt="Product"
      />

      {/* Product Details */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800">Product Name</h2>
        <p className="text-gray-600 mt-1">${price}</p>
      </div>

      {/* Quantity & Remove Controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => decrementHandler(cartItem)}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex justify-center items-center"
          >
            -
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => incrementHandler(cartItem)}
            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex justify-center items-center"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeHandler(cartItem)}
          className="text-sm text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
