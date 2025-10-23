import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PlusCircle, SquarePen, Trash2, X, AlertTriangle, Loader2 } from 'lucide-react';
// import AddProductModal from '../AddProductModal/AddProductModal'; // NOTE: Logic defined internally
import { Host } from '../../domain'; // <--- External Host Import Preserved

// --- CUSTOM CONFIRMATION MODAL (Replaces window.confirm) ---
const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm transform scale-100 transition-transform duration-300 ease-out border border-red-100">
        <div className="flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 text-center mb-6">{message}</p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl shadow-md hover:bg-red-700 transition duration-200 transform hover:scale-[1.02]"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PRODUCT ADD/EDIT MODAL (Simulates AddProductModal) ---
// NOTE: Since ProductModal relies on 'product', 'onClose', and 'refreshTable' props, 
// I've kept the component logic here and renamed it to ProductModal to match the component body below.
const ProductModal = ({ product, onClose, refreshTable }) => {
  const isEditing = !!product?._id;
  const [formData, setFormData] = useState({
    name: product?.name || '',
    quantity: product?.quantity || '',
    price: product?.price || '',
    description: product?.description || '',
    _id: product?._id || null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (isSaving) return;
    
    if (!formData.name || formData.quantity === '' || formData.price === '') {
        setError("Please fill in Name, Quantity, and Price.");
        return;
    }

    setIsSaving(true);
    try {
      const apiPath = isEditing 
        ? `${Host.URL}products/${formData._id}` 
        : `${Host.URL}products`;
      
      const method = isEditing ? axios.put : axios.post;
      
      await method(apiPath, formData);
      refreshTable(); // Success
    } catch (err) {
      console.error('Failed to save product:', err);
      setError(`Failed to save product. Server returned: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-40 p-4 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg transform scale-100 transition-transform duration-500 ease-out">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h3 className="text-2xl font-extrabold text-gray-900">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="text-gray-400 p-1 rounded-full hover:bg-gray-100 hover:text-gray-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-xl text-sm font-medium">
              Error: {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition duration-150 tabular-nums"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-200 rounded-xl shadow-sm p-3 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition duration-150 tabular-nums"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className={`flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out ${
                isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:scale-[1.02]'
              }`}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" /> Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Add Product'
              )}
            </button>
          </div>
        </form>
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

  // State for custom delete confirmation
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    productId: null,
  });

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${Host.URL}products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
      setProducts([]); // Clear on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Delete (Opens custom confirmation modal, replaces window.confirm)
  const handleDelete = (id) => {
    setConfirmState({
      isOpen: true,
      productId: id,
    });
  };

  // Execute deletion after confirmation
  const executeDelete = async () => {
    if (!confirmState.productId) return;
    setConfirmState({ ...confirmState, isOpen: false });

    const productIdToDelete = confirmState.productId;
    // Optimistic UI update for better UX/performance
    const originalProducts = products;
    setProducts(products.filter(p => p._id !== productIdToDelete));

    try {
      await axios.delete(`${Host.URL}products/${productIdToDelete}`);
    } catch (err) {
      console.error("Delete failed", err);
      // Rollback on failure
      setProducts(originalProducts);
    }
  };

  // Open modal for add or edit
  const openModal = (product = null) => {
    setEditProduct(product);
    setShowModal(true);
  };

  // Refresh table after add/edit
  const refreshTable = () => {
    fetchProducts();
    setShowModal(false);
    setEditProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-['Inter']">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pt-4">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 sm:mb-0">Product Inventory</h2>
          
          {/* Add Product Button - Highly Styled */}
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg transition duration-300 ease-in-out hover:bg-blue-700 hover:shadow-xl transform hover:scale-[1.02]"
            title="Add New Product"
          >
            <PlusCircle className="w-5 h-5" /> 
            Add Product
          </button>
        </div>

        {/* Main Table Card - Extreme UI/UX Focus */}
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden ring-1 ring-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            
            {/* Table Header */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Image</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Quantity</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Price (₹)</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Actions</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="bg-white divide-y divide-gray-100">
              
              {/* Loading State */}
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-gray-500">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-blue-500 animate-spin" />
                    <p className="font-medium">Fetching data from backend...</p>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100 hover:bg-blue-50 transition-all duration-200 group">
                    <td className="p-4">
                      {/* 🔴 CORRECTED LINE: Using p.image directly as it is the full, hosted URL 🔴 */}
                      <img
                        src={p.image} 
                        alt={p.name}
                        className="h-12 w-12 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-[1.05]"
                        // Placeholder for broken image links
                     ></img>
                    </td>
                    <td className="p-4 text-gray-900 font-semibold text-base">{p.name}</td>
                    <td className="p-4 text-gray-600 tabular-nums">{p.quantity}</td>
                    <td className="p-4 text-green-600 font-bold tabular-nums">
                      ₹{p.price?.toLocaleString('en-IN') || 0}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {/* Edit Button - Enhanced Hover */}
                        <button
                          onClick={() => openModal(p)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                          title="Edit Product"
                        >
                          <SquarePen className="w-5 h-5" />
                        </button>
                        {/* Delete Button - Enhanced Hover */}
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
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
                    No products found. Check your backend connection at `http://localhost:3000/products`.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conditional Rendering of the Modal */}
      {showModal && (
        <ProductModal onClose={() => setShowModal(false)} refreshTable={refreshTable} product={editProduct} />
      )}

      {/* Deletion Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        title="Confirm Deletion"
        message="You are about to permanently delete this product. This action cannot be reversed."
        onConfirm={executeDelete}
        onCancel={() => setConfirmState({ isOpen: false, productId: null })}
      />
    </div>
  );
};

export default Dashboard;
