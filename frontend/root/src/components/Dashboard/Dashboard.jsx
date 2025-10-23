import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PlusCircle, SquarePen, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
import AddProductModal from '../AddProductModal/AddProductModal';
import { Host } from '../../domain';

// --- CONFIRMATION MODAL ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-red-100">
        <div className="flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmState, setConfirmState] = useState({ isOpen: false, productId: null });

  // 🔹 API BASE (Render or localhost automatically handled)
  const API_BASE = Host.URL.endsWith("/") ? Host.URL.slice(0, -1) : Host.URL;

  // --- FETCH PRODUCTS ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- HANDLE DELETE ---
  const handleDelete = (id) => {
    setConfirmState({ isOpen: true, productId: id });
  };

  const executeDelete = async () => {
    if (!confirmState.productId) return;
    setConfirmState({ ...confirmState, isOpen: false });

    const productIdToDelete = confirmState.productId;
    const originalProducts = products;
    setProducts(products.filter(p => p._id !== productIdToDelete));

    try {
      await axios.delete(`${API_BASE}/products/${productIdToDelete}`);
    } catch (err) {
      console.error("Delete failed:", err);
      setProducts(originalProducts);
    }
  };

  // --- HANDLE MODAL ---
  const openModal = (product = null) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const refreshTable = () => {
    fetchProducts();
    setShowModal(false);
    setEditProduct(null);
  };
// <a href="https://imgbb.com/"><img src="" alt="wwimages" border="0"></a>
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 sm:mb-0">Product Inventory</h2>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-blue-700 hover:shadow-xl transform hover:scale-[1.02] transition"
          >
            <PlusCircle className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase w-20">Image</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase w-32">Quantity</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase w-32">Price (₹)</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase w-32">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-blue-500 animate-spin" />
                    <p>Fetching data...</p>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-blue-50 transition duration-200 group">
                    <td className="p-4">
                      <img
                        src={p.image || "https://placehold.co/100x100?text=N/A"}
                        alt={p.name}
                        className="h-12 w-12 object-cover rounded-lg shadow-md group-hover:scale-[1.05] transition-transform"
                        onError={(e) => { e.target.src = "https://placehold.co/100x100?text=N/A"; }}
                      />
                    </td>
                    <td className="p-4 text-gray-900 font-semibold">{p.name}</td>
                    <td className="p-4 text-gray-600">{p.quantity}</td>
                    <td className="p-4 text-green-600 font-bold">₹{p.price?.toLocaleString('en-IN') || 0}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openModal(p)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                          title="Edit Product"
                        >
                          <SquarePen className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    No products found. Check your backend connection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          refreshTable={refreshTable}
          product={editProduct}
        />
      )}

      {/* DELETE CONFIRMATION */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title="Confirm Deletion"
        message="You are about to permanently delete this product. This action cannot be undone."
        onConfirm={executeDelete}
        onCancel={() => setConfirmState({ isOpen: false, productId: null })}
      />
    </div>
  );
};

export default Dashboard;
