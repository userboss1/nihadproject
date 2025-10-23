import React from "react";
import { Plus } from "lucide-react";

export const ProductList = ({ products, addToCart, loading }) => {
  if (loading) return <p className="text-gray-500">Loading products...</p>;

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="p-4 border border-gray-200 rounded-xl text-center flex flex-col items-center"
          >
            <img
              src={`http://localhost:3000${product.image}`}
              alt={product.name}
              className="h-24 w-24 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-500">₹{product.price?.toFixed(2) || 0}</p>
            <p className="text-gray-400 mb-2">Stock: {product.quantity}</p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.quantity === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
