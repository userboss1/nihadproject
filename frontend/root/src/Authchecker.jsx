import React, { useState, useContext, createContext } from 'react';
import { LogOut, User, Lock } from 'lucide-react';

// 1. Create the Authentication Context
// We export this context to be used by the provider and consumers.
const AuthContext = createContext(null);

// Custom hook to use the auth context easily
const useAuth = () => {
  return useContext(AuthContext);
};

// 2. AuthProvider Component
// This component manages the state and provides the login/logout functions
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data (null means logged out)
  const [error, setError] = useState('');

  // Hardcoded Credentials
  const VALID_USERNAME = 'nihad';
  const VALID_PASSWORD = '1111';

  const login = (username, password) => {
    setError(''); // Clear previous errors
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      // For simplicity, just store the username upon successful login
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
// Handles the login form and validation logic
const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
    // Note: The conditional rendering in the main App component handles navigation
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2 text-indigo-600">
          {/* Using lucide-react icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.3-3.9a9 9 0 1 0-7.3 7.3L5.4 17H2Z"/><path d="M18.8 9.2a6.5 6.5 0 0 0-4.6-4.6"/><path d="M15.4 15.4 17 17l-3 3"/></svg>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to your account
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

// 4. Protected Main Application Component (Dashboard)
const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-6 sm:p-10 border border-gray-200">
        <header className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard text-indigo-500"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            Welcome, {user.name}!
          </h1>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition duration-150 ease-in-out"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="bg-indigo-50 p-6 rounded-lg shadow-inner border border-indigo-200">
            <h2 className="text-xl font-semibold text-indigo-700 mb-2">Protected Content Area</h2>
            <p className="text-gray-600">
              This entire section is guarded by the `AuthContext`. Only authenticated users can view this dashboard content. You have successfully implemented client-side context-based authentication!
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-green-50 p-6 rounded-lg shadow-inner border border-green-200">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Context State Check</h2>
            <p className="text-gray-600">
              The user object (`{user.name}`) is stored in the React Context and is accessible across all protected components.
            </p>
          </div>
        </section>
        
        <footer className="mt-8 pt-4 border-t border-gray-100 text-center text-sm text-gray-400">
            <p>Authentication Immersive Demo | Powered by React Context</p>
        </footer>
      </div>
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
    // If user exists, show the dashboard. Otherwise, show the login screen.
    return user ? <Dashboard /> : <LoginScreen />;
}
