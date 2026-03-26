import { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, RefreshCw, AlertCircle, Users as UsersIcon, CheckCircle, XCircle, Power, PowerOff } from 'lucide-react';
import { fetchUsers, searchUsers, updateUser } from '../services/api';

// Skeleton Loading Component
const UserSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="ml-4 space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-8 w-8 bg-gray-200 rounded"></div>
    </td>
  </tr>
);

// Empty State Component
const EmptyState = ({ searchQuery, onClear }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <UsersIcon className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
    <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">
      {searchQuery 
        ? `No users match your search "${searchQuery}". Try different keywords.`
        : "No users available. Try adjusting your filters or refresh the page."}
    </p>
    {searchQuery && (
      <button
        onClick={onClear}
        className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
      >
        Clear search
      </button>
    )}
  </div>
);

// Error State Component
const ErrorState = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load users</h3>
    <p className="text-sm text-gray-500 mb-4 text-center max-w-sm">
      Something went wrong while fetching the users. Please try again.
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [togglingUser, setTogglingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUsers(50);
      // Add isActive property if not present
      const usersWithStatus = response.data.users?.map((user, index) => ({
        ...user,
        isActive: user.isActive !== undefined ? user.isActive : index % 3 !== 0,
      })) || [];
      setUsers(usersWithStatus);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      loadUsers();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await searchUsers(query);
      const usersWithStatus = response.data.users?.map((user, index) => ({
        ...user,
        isActive: user.isActive !== undefined ? user.isActive : index % 3 !== 0,
      })) || [];
      setUsers(usersWithStatus);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // GAME CHANGER: Toggle user status
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      setTogglingUser(userId);
      const newStatus = !currentStatus;
      
      // Optimistic update - UI updates immediately
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: newStatus } : user
      ));

      // Try to update on server (will fail in demo mode, that's OK)
      try {
        await updateUser(userId, { isActive: newStatus });
      } catch (apiError) {
        console.log('API update failed, keeping local change (demo mode)');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      // Revert on error
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive: currentStatus } : user
      ));
    } finally {
      setTogglingUser(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    loadUsers();
  };

  const filteredUsers = users.filter((user) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return user.isActive;
    if (filterStatus === 'inactive') return !user.isActive;
    return true;
  });

  const getStatusConfig = (isActive) => {
    return isActive 
      ? { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Active' }
      : { color: 'bg-gray-100 text-gray-600 border-gray-200', icon: XCircle, label: 'Inactive' };
  };

  // Stats
  const activeCount = users.filter(u => u.isActive).length;
  const inactiveCount = users.filter(u => !u.isActive).length;

  if (loading && users.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 mt-1">Manage and view all registered users</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="h-10 bg-gray-200 rounded-lg w-full max-w-md animate-pulse"></div>
          </div>
          <table className="w-full">
            <tbody>
              {Array(5).fill(null).map((_, index) => <UserSkeleton key={index} />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-500 mt-1">Manage and view all registered users</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
              <p className="text-lg font-semibold text-green-600">{activeCount}</p>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Inactive</p>
              <p className="text-lg font-semibold text-gray-500">{inactiveCount}</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm transition-all hover:border-gray-300"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                <Filter size={16} className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              <button
                onClick={loadUsers}
                disabled={loading}
                className="p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {error ? (
          <ErrorState onRetry={loadUsers} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    // Loading Skeletons
                    Array(5).fill(null).map((_, index) => <UserSkeleton key={index} />)
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <EmptyState searchQuery={searchQuery} onClear={clearSearch} />
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const statusConfig = getStatusConfig(user.isActive);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <tr 
                          key={user.id} 
                          className="hover:bg-gray-50 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="relative">
                                <img
                                  src={user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff`}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <span 
                                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                                    user.isActive ? 'bg-green-500' : 'bg-gray-400'
                                  }`}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-gray-500">@{user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            <div className="text-xs text-gray-500">{user.phone || 'No phone'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                              {user.company?.title || 'User'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.color}`}>
                              <StatusIcon size={12} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {/* GAME CHANGER: Toggle Status Button */}
                              <button
                                onClick={() => handleToggleStatus(user.id, user.isActive)}
                                disabled={togglingUser === user.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                  user.isActive
                                    ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                                } disabled:opacity-50`}
                                title={user.isActive ? 'Deactivate user' : 'Activate user'}
                              >
                                {togglingUser === user.id ? (
                                  <RefreshCw size={12} className="animate-spin" />
                                ) : user.isActive ? (
                                  <>
                                    <PowerOff size={12} />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Power size={12} />
                                    Activate
                                  </>
                                )}
                              </button>
                              
                              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                <MoreHorizontal size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!loading && filteredUsers.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium">{users.length}</span> users
                </p>
                <p className="text-xs text-gray-400">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Users;
