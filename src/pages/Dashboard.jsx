import { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
// Skeleton Card Component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
    </div>
    <div className="mt-4 flex items-center gap-2 animate-pulse">
      <div className="h-4 w-12 bg-gray-200 rounded"></div>
      <div className="h-4 w-20 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Skeleton Chart Component
const SkeletonChart = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse"></div>
    <div className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
  </div>
);

// Error State Component
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load dashboard</h3>
    <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">
      Something went wrong while fetching the dashboard data.
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
    >
      <RefreshCw size={16} />
      Try Again
    </button>
  </div>
);
import { fetchDashboardStats, fetchUsers, fetchCarts } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chartData, setChartData] = useState([
    { name: 'Jan', revenue: 4000, orders: 240 },
    { name: 'Feb', revenue: 3000, orders: 198 },
    { name: 'Mar', revenue: 5000, orders: 300 },
    { name: 'Apr', revenue: 4500, orders: 280 },
    { name: 'May', revenue: 6000, orders: 390 },
    { name: 'Jun', revenue: 5500, orders: 350 },
  ]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try real API first
      const response = await fetchDashboardStats();
      const data = response.data;

      setStats({
        totalUsers: data.totalUsers || 0,
        totalOrders: data.totalOrders || 0,
        revenue: data.revenue || 0,
        activeUsers: data.activeUsers || 0,
      });

      if (data.chartData && data.chartData.length > 0) {
        setChartData(data.chartData);
      }
    } catch (error) {
      console.log('Real API failed, using dummyjson fallback');
      // FALLBACK: Use dummyjson.com data
      try {
        const [usersRes, cartsRes] = await Promise.all([
          fetchUsers(100),
          fetchCarts(),
        ]);

        const totalRevenue = cartsRes.data.carts?.reduce((sum, cart) => sum + (cart.total || 0), 0) || 0;

        setStats({
          totalUsers: usersRes.data.total || usersRes.data.users?.length || 0,
          totalOrders: cartsRes.data.total || cartsRes.data.carts?.length || 0,
          revenue: totalRevenue,
          activeUsers: Math.floor((usersRes.data.users?.length || 0) * 0.7),
        });
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setError('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Stat Card Component with hover effects
  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const isPositive = trend === 'up';
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              {value}
            </h3>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>

        {trendValue && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full ${
                isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {isPositive ? '+' : '-'}{trendValue}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <ErrorState onRetry={loadDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button
          onClick={loadDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="12"
          color="blue"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="8"
          color="green"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="23"
          color="purple"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Activity}
          trend="down"
          trendValue="5"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12.5% this month
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Orders Overview</h3>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              8.2% avg growth
            </span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value.toLocaleString()} orders`, 'Orders']}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
