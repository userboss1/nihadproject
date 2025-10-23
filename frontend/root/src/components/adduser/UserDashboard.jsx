import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // 👈 Import Framer Motion
import AddUserModal from "./AddUserModal.jsx";
import { Eye, Plus, Edit2, Trash, UserCheck } from "lucide-react"; // Added UserCheck for a subtle touch
import { Host } from "../../domain.js";

// Framer Motion Variants for Staggered List Entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const UserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  // --- Data Fetching ---
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${Host.URL}users`); 
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      // Optional: Show an error notification
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- CRUD Handlers ---
  const handleDelete = async (id, name) => {
    // Sharp, modern confirmation text
    if (!window.confirm(`⚠️ Permanently delete ${name}'s account? This action cannot be undone.`)) return;
    try {
      await axios.delete(`${Host.URL}users/delete/${id}`);
      // Optimistic UI update: Remove the user immediately for a faster feel
      setUsers(prev => prev.filter(user => user._id !== id));
      // Re-fetch in the background to confirm deletion
      // fetchUsers(); 
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("🚫 Failed to delete user. Please check server status.");
      fetchUsers(); // Re-fetch on error to revert optimistic update
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowAddUser(true);
  };

  // Function to close the modal and refresh data
  const handleModalClose = () => {
    setShowAddUser(false);
    setEditingUser(null);
    fetchUsers(); // Refresh the list after any modal action
  };

  // --- JSX Rendering ---
  return (
    <div className="p-6 md:p-10 max-w-8xl mx-auto min-h-screen bg-gray-50 font-sans">
      
      {/* Header with Sharp Typography */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-5 border-b-4 border-blue-600/50"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-blue-600"/> 
            Access Control Panel
        </h1>
        <button
          onClick={() => {
            setEditingUser(null);
            setShowAddUser(true);
          }}
          className="flex items-center justify-center gap-2 mt-4 sm:mt-0 px-6 py-3 text-base font-bold bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/50 hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/70"
          aria-label="Add a new user"
        >
          <Plus className="w-5 h-5" /> Provision New User
        </button>
      </motion.div>

      ---

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64 text-lg text-gray-500">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full mr-3"></motion.div>
            Loading user directory...
        </div>
      ) : (
        /* User Table (Enhanced Sharp Design) */
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="overflow-x-auto border border-gray-200 rounded-2xl shadow-2xl shadow-gray-300/50"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                {/* Applied text-gray-700 and font-semibold for sharper header */}
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User Identity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email Address</th>
                <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact No.</th>
                <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Security Credential</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Management</th>
              </tr>
            </thead>
            <motion.tbody 
                variants={containerVariants} 
                initial="hidden" 
                animate="visible" 
                className="bg-white divide-y divide-gray-100"
            >
              {/* Conditional Rendering for Empty State */}
              {users.length === 0 ? (
                  <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic font-medium">
                          No active user records found. Initiate provisioning now!
                      </td>
                  </tr>
              ) : (
                  users.map((u) => (
                    // Framer Motion for Row Entrance
                    <motion.tr 
                        key={u._id} 
                        variants={itemVariants}
                        className="hover:bg-blue-50/70 transition duration-200 border-l-4 border-transparent hover:border-blue-500"
                    >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">{u.email}</td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.phone || <span className="text-gray-400 italic">Unspecified</span>}</td>
                        <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-mono text-gray-700 text-lg">••••••••</span>
                            <button className="ml-3 text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100 transition" aria-label={`View password for ${u.name}`}>
                                <Eye className="inline w-4 h-4" />
                            </button>
                        </td>
                        
                        {/* Actions Column with Micro-interactions */}
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex justify-center gap-3">
                                {/* Edit Button */}
          
                                
                                {/* Delete Button */}
                                <motion.button
                                    onClick={() => handleDelete(u._id, u.name)}
                                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-red-600 p-3 rounded-full transition"
                                    aria-label={`Delete user ${u.name}`}
                                >
                                    <Trash className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </td>
                    </motion.tr>
                  ))
              )}
            </motion.tbody>
          </table>
        </motion.div>
      )}

      ---
      
      {/* Modal with Animation */}
      {showAddUser && (
        <AddUserModal
          onClose={handleModalClose}
          initialData={editingUser}
        />
      )}
    </div>
  );
};

export default UserDashboard;