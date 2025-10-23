import React, { useState, useContext, createContext } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut, User, Lock,
  Package, LayoutDashboard, LineChart, Users, Settings, ChevronLeft, Plus, Rocket, CreditCard,
} from 'lucide-react';
import Dashboard from './components/Dashboard/Dashboard';
import UserDashboard from './components/adduser/UserDashboard';
import SalesAnalytics from './components/analytics/SalesAnalytics';
import PolicyReader from './PolicyReader';
import TransactionHistory from './TransactionHistory';

// --- AUTHENTICATION CONTEXT (From Previous Step) ---

// 1. Create the Authentication Context
const AuthContext = createContext(null);

const useAuth = () => {
  return useContext(AuthContext);
};

// 2. AuthProvider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // Hardcoded Credentials
  const VALID_USERNAME = 'nihad';
  const VALID_PASSWORD = '1111';

  const login = (username, password) => {
    setError('');
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setUser({ name: username });
      return true;
    } else {
      setError('Invalid username or password.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError('');
  };

  const value = {
    user,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. LoginScreen Component
const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2 text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.3-3.9a9 9 0 1 0-7.3 7.3L5.4 17H2Z"/><path d="M18.8 9.2a6.5 6.5 0 0 0-4.6-4.6"/><path d="M15.4 15.4 17 17l-3 3"/></svg>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to Admin Panel
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username (nihad)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password (1111)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-md">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- MOCK COMPONENTS FOR NAVIGATION ---





const SalesAnalyticsMock = () => (
  <ContentBox title="Sales Analytics">
    <p>Visualize key performance indicators and sales trends here.</p>
  </ContentBox>
);




// --- SIDEBAR STRUCTURE (From User Code) ---

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User", icon: Users },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "transactions", label: "Transaction", icon: CreditCard }, // Changed ID from 'settings' to 'transactions'
  { id: "policy", label: "Company Policy", icon: Rocket }, // Changed ID from 'settings' to 'policy'
];

const sidebarVariants = {
  open: { transition: { staggerChildren: 0.07 } },
  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const AnimatedMenuItem = ({ item, activePage, setActivePage, isSidebarOpen }) => {
  const Icon = item.icon;
  const isActive = activePage === item.id;

  return (
    <motion.li
      variants={{
        open: { opacity: 1, y: 0 },
        closed: { opacity: 1, y: 0, transition: { duration: 0.1 } },
      }}
      whileHover={{ 
        scale: isSidebarOpen ? 1.01 : 1,
        x: isSidebarOpen ? 3 : 0, 
        boxShadow: isActive ? "0 4px 15px rgba(37, 99, 235, 0.4)" : "0 2px 10px rgba(0, 0, 0, 0.05)"
      }} 
      whileTap={{ scale: 0.99 }}
      className="list-none relative" 
    >
      <button
        onClick={() => setActivePage(item.id)}
        className={`w-full flex items-center gap-4 py-3 rounded-xl cursor-pointer text-base transition-all duration-300 transform border-2 ${
          isActive
            ? "bg-white text-blue-600 font-bold border-blue-600 shadow-lg shadow-blue-200/50"
            : "text-gray-600 hover:bg-gray-50 border-transparent hover:text-gray-800"
        } ${isSidebarOpen ? 'pl-5 pr-4' : 'justify-center p-3'}`}
      >
        {isActive && (
          <motion.div
            layoutId="active-indicator"
            className="absolute left-0 w-1 bg-blue-600 h-3/4 my-auto rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
        
        <motion.div
          animate={{ rotate: isActive && isSidebarOpen ? 360 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-1 rounded-full transition-colors ${isActive ? 'bg-blue-100/50' : 'text-gray-500'}`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        
        <motion.span
          initial={false}
          animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
          transition={{ duration: 0.2 }}
          className={`font-medium whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        >
          {item.label}
        </motion.span>
      </button>
    </motion.li>
  );
};


const Sidebar = ({ setActivePage, activePage, isSidebarOpen, toggleSidebar }) => {
    const { logout } = useAuth();

  return (
    <motion.aside
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      initial={false}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white min-h-screen p-6 shadow-2xl z-20 sticky top-0 border-r border-gray-100 overflow-hidden"
    >
      {/* Logo/Brand Section (Adjusted for Collapse) */}
      <div className="mb-12 flex items-center justify-between pb-5 border-b border-gray-100">
        <div className="flex items-center gap-3 overflow-hidden">
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-3 rounded-full bg-blue-600 shadow-xl shadow-blue-500/40 shrink-0"
            >
                <Package className="w-7 h-7 text-white" />
            </motion.div>
            
            <motion.h2
                animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                transition={{ duration: 0.1 }}
                className="text-3xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap"
            >
              <span className="text-blue-600">Admin</span>
            </motion.h2>
        </div>

        {/* Toggle Button */}
        <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition duration-150 shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: isSidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
        >
            <ChevronLeft className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Navigation Menu */}
      <motion.nav className="relative" layout>
        <motion.ul variants={sidebarVariants} initial="hidden" animate="visible" className="p-0 m-0 space-y-4"> 
          {menuItems.map((item) => (
            <AnimatedMenuItem
              key={item.id}
              item={item}
              activePage={activePage}
              setActivePage={setActivePage}
              isSidebarOpen={isSidebarOpen}
            />
          ))}
        </motion.ul>
      </motion.nav>
      
      {/* Logout Button (Fixed position at the bottom) */}
      <div className="absolute bottom-6 left-0 w-full px-6">
        <button
            onClick={logout}
            className={`w-full flex items-center py-3 rounded-xl cursor-pointer text-base transition-all duration-300 transform border-2 text-red-600 hover:bg-red-50 border-transparent hover:text-red-800 ${isSidebarOpen ? 'pl-5 pr-4' : 'justify-center p-3'}`}
        >
            <div className={`p-1 rounded-full transition-colors text-red-500 ${isSidebarOpen ? 'bg-red-100/50' : ''}`}>
                <LogOut className="w-5 h-5" />
            </div>
            <motion.span
                initial={false}
                animate={{ opacity: isSidebarOpen ? 1 : 0, width: isSidebarOpen ? "auto" : 0 }}
                transition={{ duration: 0.2 }}
                className={`font-medium whitespace-nowrap overflow-hidden ${isSidebarOpen ? 'block ml-4' : 'hidden'}`}
            >
                Logout
            </motion.span>
        </button>
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ delay: isSidebarOpen ? 0.3 : 0 }}
          className="text-xs text-gray-400 pt-2 text-center"
        >
          Admin Panel UI v3.0
        </motion.div>
      </div>
    </motion.aside>
  );
};


// 4. Protected Main Application Layout
// This component contains the sidebar and the content, rendered only after login.
const MainLayout = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const handleAddProductClose = () => setShowAddProduct(false);

    const renderPage = () => {
        switch (activePage) {
        case "dashboard":
            return <Dashboard onAddClick={() => setShowAddProduct(true)} />;
        case "users":
            return <UserDashboard />;
        case "analytics":
            return <SalesAnalytics />;
        case "transactions": // Matches new menuItems ID
            return <TransactionHistory/>;
        case "policy": // Matches new menuItems ID
            return <PolicyReader />;
        default:
            return <Dashboard onAddClick={() => setShowAddProduct(true)} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans antialiased">
            <Sidebar 
                setActivePage={setActivePage} 
                activePage={activePage} 
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            
            {/* Main Content Area */}
            <main className="flex-1 relative p-6 md:p-10 overflow-auto">
                {renderPage()}
                {showAddProduct && <AddProductModalMock onClose={handleAddProductClose} />}
            </main>
        </div>
    );
};


// 5. Main App Component (handles Context Provider and Conditional Rendering)
export default function App() {
  return (
    <AuthProvider>
      <AuthChecker />
    </AuthProvider>
  );
}

// Separate component to consume context and render conditionally
const AuthChecker = () => {
    const { user } = useAuth();
    // If user exists, show the protected MainLayout. Otherwise, show the LoginScreen.
    return user ? <MainLayout /> : <LoginScreen />;
}
