import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingCart, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">Admin Pro</h1>
        <p className="text-sm text-gray-500 mt-1">SaaS Dashboard</p>
      </div>

      <nav className="mt-6 px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
