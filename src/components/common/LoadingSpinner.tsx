
import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        </div>
        <p className="text-xl font-semibold text-gray-700" dir="rtl">بنيان الذكي</p>
        <p className="text-gray-500 mt-2" dir="rtl">جاري التحميل...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
