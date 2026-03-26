import { useState, useEffect } from 'react';
import { fetchCarts } from '../services/api';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchCarts();
      const carts = response.data.carts.map((cart, index) => ({
        ...cart,
        status: index % 3 === 0 ? 'pending' : index % 3 === 1 ? 'completed' : 'cancelled',
        orderNumber: `ORD-${String(cart.id).padStart(4, '0')}`,
        customer: `Customer ${cart.id}`,
      }));
      setOrders(carts);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          label: 'Completed',
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: Clock,
          label: 'Pending',
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: XCircle,
          label: 'Cancelled',
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: Package,
          label: 'Unknown',
        };
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-500 mt-1">View and manage customer orders</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { label: 'Total Orders', value: orders.length, color: 'bg-blue-500' },
          { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Completed', value: orders.filter((o) => o.status === 'completed').length, color: 'bg-green-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <Package size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <div className="flex gap-2">
              {['all', 'pending', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    filterStatus === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-primary-600">{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.products?.length || 0} items</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${order.total}</div>
                      <div className="text-xs text-gray-500">${order.discountedTotal} after discount</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        <StatusIcon size={14} />
                        {statusConfig.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </div>
      </div>
    </div>
  );
};

export default Orders;
