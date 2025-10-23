import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import axios from "axios";
import { Host } from "../../domain";

const AddProductModal = ({ onClose, product }) => {
  const [form, setForm] = useState({ name: "", quantity: "", price: "", image: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        quantity: product.quantity,
        price: product.price || "",
        image: product.image || "",
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      if (product) {
        // Edit existing product
        await axios.put(`${Host.URL}products/update/${product._id}`, {
          quantity: form.quantity,
          price: form.price,
          image: form.image,
        });
      } else {
        // Add new product
        await axios.post(`${Host.URL}products/add`, form);
      }

      setMessage({
        type: "success",
        text: product ? "✅ Product updated successfully!" : "✅ Product added successfully!",
      });
      setTimeout(onClose, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "❌ Error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-11/12 max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                disabled={!!product} // Disable name edit if editing
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter product name"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter quantity"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter price"
              />
            </div>

            {/* Image URL / Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL / Text
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter image URL or text reference"
              />
            </div>

            {/* Message */}
            {message.text && (
              <div
                className={`flex items-center gap-2 p-3 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {message.type === "success" ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">{message.text}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? product
                    ? "Updating..."
                    : "Saving..."
                  : product
                  ? "Update Product"
                  : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
