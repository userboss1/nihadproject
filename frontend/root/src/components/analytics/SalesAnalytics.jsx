import React, { useState, useEffect, useMemo } from "react"; // Added useMemo for average calculation
import axios from "axios";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, TrendingUp, BarChart, Loader, AlertCircle, ListChecks, Users, PieChart as PieIcon } from "lucide-react";
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart, // 👈 Imported AreaChart
  Area,      // 👈 Imported Area
  ReferenceLine, // 👈 Imported ReferenceLine
  PieChart, 
  Pie,     
  Cell,    
  Legend,  
} from 'recharts';
import { Host } from "../../domain";

// --- UTILS & CONFIG ---

// Format price to USD (More robust, moved outside main component)
const formatCurrency = (amount, compact = true) => {
  const numericAmount = parseFloat(amount) ?? 0;
  if (isNaN(numericAmount)) return '₹0'; // Changed default return symbol
  
  return new Intl.NumberFormat('en-IN', { // Changed locale to en-IN for Indian formatting rules
    style: 'currency', 
    currency: 'INR', // Changed currency code to INR
    notation: compact ? 'compact' : 'standard', 
    compactDisplay: 'short',
    minimumFractionDigits: compact ? 0 : 2
  }).format(numericAmount);
};

// Tooltip formatter for charts (always shows full value)
const tooltipFormatter = (value) => formatCurrency(value, false);
const tooltipLabelFormatter = (label) => `Date/Month: ${label}`;

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.07, delayChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Card Component (KPI)
const KpiCard = ({ icon: Icon, title, value, color, format }) => (
  <motion.div
    className={`bg-white p-6 rounded-xl shadow-lg border-t-4 ${color} transform hover:scale-[1.01] transition duration-300 cursor-pointer`}
    variants={itemVariants}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
      <Icon className={`w-6 h-6 text-opacity-80 ${color.replace('border-t-4', 'text')}`} />
    </div>
    <p className="text-4xl font-extrabold text-gray-900 mt-2">
      {format === 'currency' ? formatCurrency(value, false) : (value ?? 0).toLocaleString()}
    </p>
  </motion.div>
);


// --- PIE CHART COMPONENT (Enhanced) ---
const ProductRevenuePieChart = ({ totalRevenue, topProducts }) => {
  const topN = 4;
  const topData = topProducts.slice(0, topN).map(p => ({
    name: p.name,
    value: p.total,
  }));

  const otherRevenue = topProducts.slice(topN).reduce((sum, p) => sum + p.total, 0);
  const remainingRevenue = totalRevenue - topProducts.reduce((sum, p) => sum + p.total, 0) + otherRevenue;

  if (topData.length === 0) return null;

  const data = [...topData];
  if (remainingRevenue > 0) {
      data.push({ name: 'Other Revenue', value: remainingRevenue });
  }

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#9ca3af']; 

  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-2xl h-full flex flex-col" 
      variants={itemVariants}
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <PieIcon className="w-5 h-5 text-indigo-600" />
        Product Revenue Share
      </h2>
      <div className="flex-1 w-full h-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
             {/* Framer Motion Wrapper for Spin Animation */}
            <motion.g
              initial={{ rotate: -180, scale: 0.5, originX: '50%', originY: '50%' }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 50, damping: 20, delay: 0.5 }}
            >
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85} // Adjusted for better fit
                innerRadius={45} // Keeps it donut-like
                paddingAngle={2}
                fill="#8884d8"
                isAnimationActive={true}
                animationDuration={1500} 
                labelLine={false}
                label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''} 
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
            </motion.g>
            <Tooltip 
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                formatter={tooltipFormatter}
                labelFormatter={() => null} 
            />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};


// --- DAILY SALES LOG TABLE ---
const DailySalesLog = ({ dailyTrend }) => (
  <motion.div className="bg-white p-6 rounded-xl shadow-2xl h-full flex flex-col" variants={itemVariants}>
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <ListChecks className="w-5 h-5 text-purple-600" />
      Recent Daily Revenue Log
    </h2>
    <div className="overflow-y-auto max-h-96 border border-gray-100 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Revenue</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {/* Show last 10 days, reversed for most recent on top */}
          {dailyTrend.slice(-10).reverse().map((d, index) => ( 
            <tr key={d.date} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{d.date}</td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 font-semibold">{formatCurrency(d.total, false)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);


// --- MAIN COMPONENT ---
const SalesAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${Host.URL}sales/analytics`); 
        if (res.data.analytics) {
          // Ensure total is a number for all trend data
          const processedData = {
              ...res.data.analytics,
              dailyTrend: res.data.analytics.dailyTrend.map(d => ({ ...d, total: parseFloat(d.total) || 0 })),
              monthlyTrend: res.data.analytics.monthlyTrend.map(d => ({ ...d, total: parseFloat(d.total) || 0 })),
          }
          setAnalyticsData(processedData);
        } else {
          setError(res.data.message || "No analytics data available.");
        }
      } catch (err) {
        console.error("Analytics fetch failed:", err);
        setError("Failed to connect to analytics service. Check your Express server.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Calculate Average Monthly Revenue for the Reference Line
  const averageMonthlyRevenue = useMemo(() => {
    if (!analyticsData || !analyticsData.monthlyTrend.length) return 0;
    const total = analyticsData.monthlyTrend.reduce((sum, d) => sum + d.total, 0);
    return total / analyticsData.monthlyTrend.length;
  }, [analyticsData]);

  // --- RENDERING STATES (Unchanged) ---
  if (isLoading) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
        <Loader className="animate-spin w-10 h-10 text-blue-600" />
        <p className="mt-4 text-gray-600">Generating insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-red-100 border border-red-400 text-red-700 rounded-xl m-10 flex items-center gap-3 shadow-md">
        <AlertCircle className="w-6 h-6" />
        <p className="font-semibold">Error:</p> {error}
      </div>
    );
  }

  const { 
    totalRevenue, 
    totalItemsSold, 
    totalOrders, 
    topProducts, 
    dailyTrend, 
    monthlyTrend 
  } = analyticsData;

  // --- MAIN RENDER (Data Available) ---
  return (
    <motion.div 
      className="p-8 md:p-10 bg-gray-50 min-h-screen overflow-y-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Sales Analytics Dashboard</h1>
      
      {/* KPI Cards Section (Responsive) */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
        variants={containerVariants}
      >
        <KpiCard
          icon={DollarSign}
          title="Total Revenue"
          value={totalRevenue}
          color="border-t-4 border-green-600 text-green-600"
          format="currency"
        />
        <KpiCard
          icon={ShoppingCart}
          title="Items Sold"
          value={totalItemsSold}
          color="border-t-4 border-blue-600 text-blue-600"
          format="number"
        />
        <KpiCard
          icon={TrendingUp}
          title="Total Orders"
          value={totalOrders}
          color="border-t-4 border-purple-600 text-purple-600"
          format="number"
        />
      </motion.div>

      {/* TOP CHARTS AND TABLES SECTION (12-column grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Revenue ADVANCED AREA CHART (6/12 columns - Trading Style) */}
        <motion.div className="lg:col-span-6 bg-white p-6 rounded-xl shadow-2xl" variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-red-600" />
            Monthly Revenue Performance (vs. Avg)
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  {/* Gradient for the Area Fill */}
                  <linearGradient id="colorAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/> 
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/> 
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#94a3b8" />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  formatter={tooltipFormatter}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                
                {/* The Main Area Line */}
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="url(#colorAreaGradient)" 
                  dot={{ r: 4, fill: '#b91c1c' }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />

                {/* Reference Line for Average Revenue (Trading Style Benchmark) */}
                {averageMonthlyRevenue > 0 && (
                    <ReferenceLine 
                        y={averageMonthlyRevenue} 
                        stroke="#22c55e" 
                        strokeDasharray="5 5" 
                        label={{ value: `Avg: ${formatCurrency(averageMonthlyRevenue)}`, position: 'right', fill: '#22c55e', fontSize: 12, fontWeight: 'bold' }}
                    />
                )}
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Product Revenue Pie Chart (3/12 columns) */}
        <div className="lg:col-span-3">
          <ProductRevenuePieChart totalRevenue={totalRevenue} topProducts={topProducts} />
        </div>
        
        {/* Daily Revenue Line Chart (3/12 columns) */}
        <motion.div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-2xl" variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Daily Sales Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={dailyTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                  formatter={tooltipFormatter}
                  labelFormatter={tooltipLabelFormatter}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1d4ed8' }}
                  activeDot={{ r: 6 }} 
                  animationDuration={1500}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* TABLES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Top Products Table (50% width) */}
        <motion.div className="bg-white p-6 rounded-xl shadow-2xl h-full flex flex-col" variants={itemVariants}>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            Top 5 Selling Products by Quantity
          </h2>
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Product Name</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total Qty Sold</th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {topProducts.map((p, index) => (
                  <motion.tr 
                    key={p.name} 
                    className={`transition-colors ${index < 3 ? 'bg-yellow-50/50 font-bold' : 'hover:bg-gray-50'}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-blue-600 font-extrabold">{(p.quantity ?? 0).toLocaleString()}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 font-extrabold">{formatCurrency(p.total, false)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* Daily Sales Log Table (50% width) */}
        <DailySalesLog dailyTrend={dailyTrend} />
      </div>

      <div className="h-20"></div> 
    </motion.div>
  );
};

export default SalesAnalytics;