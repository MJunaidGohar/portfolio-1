import { useState, useEffect } from 'react';
import { Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import { fetchUsers, fetchCarts, fetchProducts } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Jan', revenue: 4000, orders: 240 },
    { name: 'Feb', revenue: 3000, orders: 198 },
    { name: 'Mar', revenue: 5000, orders: 300 },
    { name: 'Apr', revenue: 4500, orders: 280 },
    { name: 'May', revenue: 6000, orders: 390 },
    { name: 'Jun', revenue: 5500, orders: 350 },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [usersRes, cartsRes, productsRes] = await Promise.all([
          fetchUsers(100),
          fetchCarts(),
          fetchProducts(100),
        ]);

        const totalRevenue = cartsRes.data.carts.reduce((sum, cart) => sum + cart.total, 0);

        setStats({
          totalUsers: usersRes.data.total || usersRes.data.users.length,
          totalOrders: cartsRes.data.total || cartsRes.data.carts.length,
          revenue: totalRevenue,
          activeUsers: Math.floor(usersRes.data.users.length * 0.7),
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          trend="up"
          trendValue="12"
        />
        <Card
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          trend="up"
          trendValue="8"
        />
        <Card
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="23"
        />
        <Card
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          icon={Activity}
          trend="down"
          trendValue="5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
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
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
