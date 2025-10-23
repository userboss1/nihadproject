
// 1. Menu Items Configuration
const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User", icon: Users },
  { id: "analytics", label: "Analytics", icon: LineChart },
  { id: "settings", label: "Settings", icon: Settings },
];

// 2. Framer Motion Variants for Animation
const sidebarVariants = {
  // Used for stagger effect on menu items
  open: { transition: { staggerChildren: 0.07 } },
  closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

// 3. Animated MenuItem Component (Adjusted for Collapse)
const AnimatedMenuItem = ({ item, activePage, setActivePage, isSidebarOpen }) => {
  const Icon = item.icon;
  const isActive = activePage === item.id;

  return (
    <motion.li
      variants={{
        open: { opacity: 1, y: 0 },
        closed: { opacity: 1, y: 0, transition: { duration: 0.1 } }, // Keep item visible when collapsed
      }}
      whileHover={{ 
        scale: isSidebarOpen ? 1.01 : 1, // Only scale if open
        x: isSidebarOpen ? 3 : 0, 
        boxShadow: isActive ? "0 4px 15px rgba(37, 99, 235, 0.4)" : "0 2px 10px rgba(0, 0, 0, 0.05)"
      }} 
      whileTap={{ scale: 0.99 }}
      className="list-none relative" 
    >
      <button
        onClick={() => setActivePage(item.id)}
        // Dynamic padding based on state for better visual centering when collapsed
        className={`w-full flex items-center gap-4 py-3 rounded-xl cursor-pointer text-base transition-all duration-300 transform border-2 ${
          isActive
            ? "bg-white text-blue-600 font-bold border-blue-600 shadow-lg shadow-blue-200/50"
            : "text-gray-600 hover:bg-gray-50 border-transparent hover:text-gray-800"
        } ${isSidebarOpen ? 'pl-5 pr-4' : 'justify-center p-3'}`}
      >
        {/* Active Indicator Line (Motion based - wraps item) */}
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
          animate={{ rotate: isActive && isSidebarOpen ? 360 : 0 }} // Rotate only when open/active
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`p-1 rounded-full transition-colors ${isActive ? 'bg-blue-100/50' : 'text-gray-500'}`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        
        {/* Label (Fades out when collapsed) */}
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


// 4. Main Sidebar Component (Collapsible Design)
const Sidebar = ({ setActivePage, activePage, isSidebarOpen, toggleSidebar }) => {
  return (
    <motion.aside
      // Animate width dynamically
      animate={{ width: isSidebarOpen ? 256 : 80 }} // 256px (w-64) to 80px (w-20)
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
            
            {/* Logo Text (Fades out when collapsed) */}
            <motion.h2
                animate={{ opacity: isSidebarOpen ? 1 : 0 }}
                transition={{ duration: 0.1 }}
                className="text-3xl font-extrabold text-gray-900 tracking-tight whitespace-nowrap"
            >
              Pro<span className="text-blue-600">Admin</span>
            </motion.h2>
        </div>

        {/* Toggle Button */}
        <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition duration-150 shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            // Rotate chevron based on open state
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
      
      {/* Footer/Version Info */}
      <div className="absolute bottom-6 left-0 w-full px-6">
        <motion.div
          animate={{ opacity: isSidebarOpen ? 1 : 0 }}
          transition={{ delay: isSidebarOpen ? 0.8 : 0 }}
          className="text-xs text-gray-400 pt-4 border-t border-gray-200 text-center"
        >
          Admin Panel UI v3.0
        </motion.div>
      </div>
    </motion.aside>
  );
};

