
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">جاري التحميل...</h2>
        <p className="text-gray-500">يرجى الانتظار</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
