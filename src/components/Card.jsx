const Card = ({ title, value, icon: Icon, trend, trendValue }) => {
  const isPositive = trend === 'up';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
          <Icon size={24} className="text-primary-600" />
        </div>
      </div>

      {trendValue && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? '+' : '-'}{trendValue}%
          </span>
          <span className="text-sm text-gray-500">vs last month</span>
        </div>
      )}
    </div>
  );
};

export default Card;
