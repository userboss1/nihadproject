
        import React, { useEffect, useState } from "react";
import { Loader2, CreditCard, User, Phone, FileText, Search, Download } from "lucide-react";
import { Host } from "./domain";

// Helper function to format currency (assuming INR based on previous code)
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Original Data Fetching Logic (Preserved) ---
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // This API call is preserved as requested, though it will likely fail in the sandbox environment.
        const res = await fetch(`${Host.URL}sales/transactions`); 
        const data = await res.json();
setTransactions(data.transactions);

    } catch (err) {
        // Error handling for failed API call
        console.error("Error fetching transactions:", err);
        // For better UX, we can set empty array and stop loading
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);
  // -------------------------------------------------

  // FIX: Replaced .flatMap() with .reduce() and .concat() for wider compatibility.
  const allItems = transactions.reduce((acc, txn) => {
    const itemsWithTxnData = txn.items.map(item => ({
      ...item,
      txnId: txn._id, // Keep a reference to the main transaction ID
      totalAmount: txn.totalAmount,
      date: txn.date,
    }));
    // Concatenate the new items into the accumulator array
    return acc.concat(itemsWithTxnData);
  }, []);

  // --- Loading State UI ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-white rounded-xl shadow-lg m-6">
        <Loader2 className="animate-spin text-indigo-500 mr-2" size={40} />
        <p className="text-xl text-gray-600 font-medium">Loading Transaction Data...</p>
      </div>
    );
  }

  // --- Main Content UI ---
  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-gray-50 font-sans">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center space-x-3 mb-4 sm:mb-0">
          <FileText className="w-7 h-7 text-indigo-500" />
          <span>Detailed Transaction History</span>
        </h1>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          {/* Mock Search/Filter Input */}
          <div className="relative">
            <input 
                type="text" 
                placeholder="Search customers or products..."
                className="w-full sm:w-56 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm shadow-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Export Button */}
          <button
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-100">
        {allItems.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-300" />
            <p className="mt-4 text-xl font-semibold text-gray-900">No Transactions Recorded</p>
            <p className="mt-2 text-sm text-gray-500">
              There is no data to display. Please check the API connection or try again later.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Txn Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Date</th>
                </tr>
              </thead>
              
              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-100">
                {allItems.map((item, i) => (
                  <tr
                    key={`${item.txnId}-${i}`}
                    className="hover:bg-indigo-50/30 transition duration-150 even:bg-white odd:bg-gray-50"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <User size={16} className="text-gray-400" />
                        <div>
                            <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Phone size={12} className="mr-1" />
                                {item.customerPhone}
                            </div>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                      {item.name}
                    </td>

                    {/* Quantity */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity}
                    </td>

                    {/* Subtotal */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {formatCurrency(item.subtotal)}
                    </td>

                    {/* Payment Method */}
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                            item.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' : 
                            item.paymentMethod === 'cash' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            <CreditCard size={12} className="mr-1 my-auto" />
                            {item.paymentMethod}
                        </span>
                    </td>

                    {/* Total Txn Amount (Highlighted) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-indigo-600">
                      {formatCurrency(item.totalAmount)}
                    </td>
                    
                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                      <div className="text-gray-400 text-xs">{new Date(item.date).toLocaleTimeString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
