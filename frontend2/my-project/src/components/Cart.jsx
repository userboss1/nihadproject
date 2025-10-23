import React from "react";
import { X } from "lucide-react";

export const Cart = ({ cart, removeFromCart, updateCartQuantity, onCheckout }) => {
  const total = cart.reduce(
    (sum, p) => sum + (parseFloat(p.price) || 0) * p.quantity,
    0
  );

  return (
    <div className="w-80 bg-white rounded-2xl shadow-lg p-6 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Cart</h2>

      {cart.length === 0 && <p className="text-gray-500">Cart is empty</p>}

      <div className="flex-1 overflow-y-auto space-y-4">
        {cart.map((p) => (
          <div key={p._id} className="flex justify-between items-center border-b pb-2">
            <div>
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-600">₹{p.price?.toFixed(2) || 0}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() =>
                    updateCartQuantity(p._id, Math.max(p.quantity - 1, 1))
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{p.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(p._id, p.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <button onClick={() => removeFromCart(p._id)}>
                <X className="w-5 h-5 text-red-500" />
              </button>
              <p className="text-sm mt-1 font-semibold">
                ₹{(p.price * p.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <>
          <div className="mt-4 text-lg font-bold text-right">
            Total: ₹{total.toFixed(2)}
          </div>
          <button
            onClick={onCheckout}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
};
