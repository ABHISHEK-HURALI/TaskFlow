import React from 'react';

const StatsCard = ({ title, count, icon: Icon, color, textColor }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color} flex items-center justify-between`}>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')} ${textColor}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default StatsCard;
