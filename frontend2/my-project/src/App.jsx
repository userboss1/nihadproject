import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { Plus, X, ShoppingBag, CreditCard, Smartphone, Wallet, ArrowLeft, Check, AlertTriangle, Loader2, Search, Barcode, DollarSign, Tag, HardDrive, Cpu, Headphones, Box, Grid } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Host } from "./domain";

// --- MOCK CATEGORY ICONS (Add this data structure) ---
const categoryIcons = {
    'Mobile': Smartphone,
    'Laptop': Cpu,
    'Accessory': Headphones,
    'Storage': HardDrive,
    'Default': Box,
};

// --- TOAST NOTIFICATION COMPONENT (Unchanged) ---
const Toast = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed bottom-6 right-6 p-4 rounded-xl shadow-2xl z-[100] max-w-sm w-full flex items-center gap-3 font-medium text-sm ${
        isSuccess 
          ? 'bg-white border-l-4 border-green-500 text-gray-800' 
          : 'bg-white border-l-4 border-red-500 text-gray-800'
      }`}
    >
      {isSuccess 
        ? <Check className="w-5 h-5 text-green-500 flex-shrink-0" /> 
        : <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />}
      <span className="flex-grow">{message}</span>
      <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 transition-colors flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// --- CATEGORY FILTER COMPONENT (NEW) ---
const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col flex-shrink-0 w-48 sticky top-0">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" /> Categories
            </h3>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1">
                <motion.button
                    key="All"
                    onClick={() => onSelectCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 ${
                        !selectedCategory
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    whileHover={{ x: !selectedCategory ? 0 : 3 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Grid className="w-4 h-4" />
                    All Products
                </motion.button>

                {categories.map(cat => {
                    const LucideIcon = categoryIcons[cat] || categoryIcons.Default;
                    const isSelected = selectedCategory === cat;
                    return (
                        <motion.button
                            key={cat}
                            onClick={() => onSelectCategory(cat)}
                            className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 ${
                                isSelected
                                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                                    : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            whileHover={{ x: isSelected ? 0 : 3 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LucideIcon className="w-4 h-4" />
                            {cat}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};


// --- PRODUCT CARD COMPONENT (Refined Density) ---
const ProductCard = ({ product, addToCart }) => {
  const [isAdding, setIsAdding] = useState(false);
  const isOutOfStock = product.quantity <= 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product);
    setTimeout(() => setIsAdding(false), 600); // Faster feedback
  };

  return (
    <motion.div 
        className="group relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]"
    >
      <div className="relative p-3">
        <div className="relative w-full h-28 mb-2 bg-gray-50 rounded-md overflow-hidden border border-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${!isOutOfStock && 'group-hover:scale-110'}`}
          />
          {product.quantity < 5 && product.quantity > 0 && (
            <div className="absolute top-1 right-1 bg-yellow-600 text-white text-xs px-2 py-0.5 rounded font-bold shadow-md">
              Low Stock
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
              <span className="text-white font-bold text-sm">SOLD OUT</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-sm mb-1 text-gray-900 truncate">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-extrabold text-blue-600">
            ₹{product.price?.toFixed(2) || '0.00'}
          </span>
          <span className="text-xs text-gray-500">Qty: {product.quantity}</span>
        </div>

        <motion.button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-300 shadow-sm ${
            isAdding
              ? "bg-green-500 text-white scale-[0.98] shadow-green-500/50"
              : isOutOfStock
              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md"
          }`}
          whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
          whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4" />
              Added!
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- CART ITEM COMPONENT (Unchanged) ---
const CartItem = ({ item, removeFromCart, updateCartQuantity, maxQuantity }) => {
  return (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
    >
      <div className="flex gap-3 items-center">
        <img
          src={item.image}
          alt={item.name}
          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-gray-900 truncate">{item.name}</h3>
            <motion.button
              onClick={() => removeFromCart(item._id)}
              className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0 ml-2"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
              <button
                onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-5 h-5 flex items-center justify-center text-sm font-semibold rounded-l-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                -
              </button>
              <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
              <button
                onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                disabled={item.quantity >= maxQuantity}
                className="w-5 h-5 flex items-center justify-center text-sm font-semibold rounded-r-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                +
              </button>
            </div>
            
            <span className="font-extrabold text-base text-gray-800">
              ₹{((item.price || 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- PAYMENT METHOD SELECTION, CHECKOUT MODAL (Retained for functionality) ---
const PaymentMethod = ({ method, selected, onSelect }) => {
  const icons = { card: CreditCard, upi: Smartphone, cash: Wallet, other: ArrowLeft };
  const Icon = icons[method.id] || icons.other;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(method.id)}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
        selected === method.id
          ? "border-blue-600 bg-blue-50 shadow-lg"
          : "border-gray-300 bg-white hover:border-blue-400"
      }`}
    >
      <Icon className={`w-7 h-7 mb-2 ${selected === method.id ? "text-blue-600" : "text-gray-500"}`} />
      <div className="font-bold text-sm text-gray-800">{method.name}</div>
    </motion.button>
  );
};

const CheckoutModal = ({ cart, total, onClose, onConfirm, loading }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const paymentMethods = [
    { id: "card", name: "Card", description: "Credit/Debit" },
    { id: "upi", name: "UPI", description: "Online Payment" },
    { id: "cash", name: "Cash", description: "Pay in cash" },
  ];

  const handleConfirm = () => {
    if (step === 1) {
      if (!customerName.trim() || !customerPhone.trim()) {
        alert("🚨 Please fill in both Name and Phone fields.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!paymentMethod) {
        alert("🚨 Please select a payment method.");
        return;
      }
      onConfirm({ customerName, customerPhone, paymentMethod });
    }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-white p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="p-1 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-800">
                {step === 1 ? "Customer & Order Summary" : "Select Payment"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Customer Name (Required)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Phone Number (Required)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-3 border-b pb-2">Order Summary</h3>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item._id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.name} x {item.quantity}</span>
                        <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-blue-600">₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg shadow-inner">
                  <div className="text-sm font-medium text-blue-800">
                    <span className="font-bold">Customer:</span> {customerName} / {customerPhone}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-5 border shadow-md text-center">
                  <div className="text-5xl font-extrabold text-gray-800 mb-1 flex items-center justify-center gap-2">
                    <DollarSign className="w-8 h-8 text-green-600" />₹{total.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">Amount Due</div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 mb-4">Select Payment Method</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <PaymentMethod
                        key={method.id}
                        method={method}
                        selected={paymentMethod}
                        onSelect={setPaymentMethod}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            {loading ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                </>
            ) : step === 1 ? (
                "Continue to Payment"
            ) : (
                "CONFIRM SALE"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // NEW: Category filter state
  const barcodeRef = useRef(null); 

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Extract unique categories for the sidebar
  const uniqueCategories = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category).filter(c => c))];
    return categories.sort();
  }, [products]);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${Host.URL}sales/products`);
      
      const cleanedData = res.data.map(product => ({
        ...product,
        // Mock a category if missing, for demo purposes
        category: product.category || (product.name.includes('Phone') ? 'Mobile' : 'Accessory'), 
        price: parseFloat(product.price) || 0,
        // Mock an SKU for barcode search
        sku: product.sku || `SKU-${product._id.slice(0,4).toUpperCase()}` 
      }));

      setProducts(cleanedData);
    } catch (err) {
      console.error(err);
      setError("Cannot fetch products. Please check server connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    if (barcodeRef.current) {
        barcodeRef.current.focus();
    }
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((p) => p._id === product._id);
      
      if (exist) {
        if (exist.quantity >= product.quantity) {
             showToast(`Maximum stock of ${product.name} reached in cart.`, 'error');
             return prev;
        }
        return prev.map((p) =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleBarcodeSubmit = (e) => {
      e.preventDefault();
      const code = e.target.elements.barcode.value.trim();
      if (!code) return;
      
      const product = products.find(p => p._id === code || p.sku === code); 
      
      if (product) {
          if (product.quantity > 0) {
              addToCart(product);
              showToast(`${product.name} added.`, 'success');
              // Optionally switch to that category for visual feedback, but maybe too jarring
              // setSelectedCategory(product.category || null); 
          } else {
              showToast(`${product.name} is SOLD OUT.`, 'error');
          }
      } else {
          showToast(`Product code "${code}" not found.`, 'error');
      }
      
      // Keep the input focused and clear the field
      e.target.elements.barcode.value = '';
      if (barcodeRef.current) barcodeRef.current.focus();
  };

  const removeFromCart = (productId) =>
    setCart((prev) => prev.filter((p) => p._id !== productId));

  const updateCartQuantity = (productId, quantity) =>
    setCart((prev) =>
      prev.map((p) => {
        const productData = products.find(prod => prod._id === productId);
        const maxQuantity = productData ? productData.quantity : Infinity;

        if (quantity > maxQuantity) {
            showToast(`Cannot add more than ${maxQuantity} of this item.`, 'error');
            return p;
        }
        
        return p._id === productId ? { ...p, quantity: Math.max(1, quantity) } : p;
      })
    );

  const handleCheckout = async (paymentData) => {
    setLoading(true);
    try {
      await axios.post(
        `${Host.URL}sales/sales`,
        {
          items: cart.map((p) => ({ productId: p._id, quantity: p.quantity })),
          customerName: paymentData.customerName,
          customerPhone: paymentData.customerPhone,
          paymentMethod: paymentData.paymentMethod,
        },
        { headers: { "Content-Type": "application/json" } }
      );
    
      setShowCheckout(false);
      setCart([]);
      fetchProducts();
      
      showToast("Sale completed successfully! Stock updated.", 'success');
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Checkout failed. Server error.";
      showToast(message, 'error');
    } finally {
      setLoading(false);
      if (barcodeRef.current) {
          barcodeRef.current.focus();
      }
    }
  };

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
        return products;
    }
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);
  
  // Framer Motion Variants for Staggered Product Cards
  const productContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03, // Faster stagger
      },
    },
  };
  
  const productItemVariants = {
    hidden: { opacity: 0, y: 15 }, // Smaller slide distance
    visible: { opacity: 1, y: 0 },
  };

  // --- SPLIT-SCREEN LAYOUT ---
  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* 1. TOP HEADER (Fixed) */}
      <motion.header 
        className="bg-white shadow-md border-b-4 border-blue-600/70 flex-shrink-0"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-blue-500/50">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                Category POS
              </h1>
              <p className="text-xs text-gray-500 font-medium">Fast, Clean, Efficient</p>
            </div>
          </div>
          <div className="text-right p-1.5 bg-gray-50 rounded-md border border-gray-200">
            <div className="text-xs text-gray-500">Catalog Count</div>
            <div className="text-lg font-bold text-gray-800">{products.length}</div>
          </div>
        </div>
      </motion.header>

      {/* 2. MAIN SPLIT CONTENT AREA */}
      <div className="flex flex-1 min-h-0 p-4">
        
        {/* LEFT-LEFT PANEL: CATEGORY FILTER (NEW) */}
        <motion.div 
            className="flex flex-col flex-shrink-0" 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <CategoryFilter 
                categories={uniqueCategories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
        </motion.div>
        
        {/* LEFT-CENTER PANEL: Product Grid & Barcode (Wider space) */}
        <div className="flex flex-col flex-1 pl-4 min-h-0">
          
          {/* Barcode Input (The primary way to add items) */}
          <motion.div 
              className="flex gap-4 mb-4 flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
          >
              <form onSubmit={handleBarcodeSubmit} className="relative shadow-lg flex-1">
                  <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                      type="text"
                      name="barcode"
                      ref={barcodeRef}
                      placeholder="Scan Barcode or Enter Product SKU (e.g., SKU-1234)..."
                      className="w-full pl-10 pr-4 py-2.5 border border-blue-300 rounded-xl font-medium text-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  />
              </form>
          </motion.div>
          
          {/* Product Grid Area */}
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            {selectedCategory ? `${selectedCategory} (${filteredProducts.length})` : 'All Products'}
          </h3>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-blue-600 bg-white rounded-xl shadow-lg">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p className="font-medium">Loading product catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500 flex-1 border rounded-xl bg-white shadow-lg">
                  <p className="font-bold text-lg">No Products Found</p>
                  <p className="text-sm mt-1">Check the selected category or refresh data.</p>
              </div>
          ) : (
            <motion.div 
                className="grid grid-cols-5 gap-4 overflow-y-auto pr-2 flex-1" // 5 columns for maximum density
                variants={productContainerVariants}
                initial="hidden"
                animate="visible"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div key={product._id} variants={productItemVariants}>
                    <ProductCard product={product} addToCart={addToCart} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* RIGHT PANEL: Cart & Checkout (30% Width) */}
        <motion.div 
            className="w-96 flex-shrink-0 p-4 bg-white shadow-2xl border-l border-gray-200 flex flex-col min-h-0"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4 border-b pb-3 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800">Sales Cart</h2>
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </div>
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            <AnimatePresence>
              {cart.length === 0 ? (
                  <div className="text-center py-10">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-medium">Cart is Empty</p>
                  </div>
              ) : (
                  cart.map((item) => {
                      const productData = products.find(prod => prod._id === item._id) || {};
                      return (
                          <CartItem
                              key={item._id}
                              item={item}
                              removeFromCart={removeFromCart}
                              updateCartQuantity={updateCartQuantity}
                              maxQuantity={productData.quantity || Infinity}
                          />
                      );
                  })
              )}
            </AnimatePresence>
          </div>

          {/* Cart Footer / Checkout Button */}
          <div className="border-t border-gray-200 pt-4 mt-4 flex-shrink-0">
            <div className="flex justify-between items-center text-3xl font-extrabold mb-3">
              <span>TOTAL</span>
              <span className="text-blue-600">₹{total.toFixed(2)}</span>
            </div>

            <motion.button
              onClick={() => setShowCheckout(true)}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              whileHover={{ scale: cart.length === 0 ? 1 : 1.01 }}
              whileTap={{ scale: cart.length === 0 ? 1 : 0.99 }}
            >
              <CreditCard className="inline w-5 h-5 mr-2" />
              FINALIZE SALE
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modals and Toasts */}
      <AnimatePresence>
        {showCheckout && (
          <CheckoutModal
            cart={cart}
            total={total}
            onClose={() => setShowCheckout(false)}
            onConfirm={handleCheckout}
            loading={loading}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

    </div>
  );
}
