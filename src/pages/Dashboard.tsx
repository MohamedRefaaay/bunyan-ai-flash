
import React from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardStats from '@/components/dashboard/DashboardStats';
import ActionCards from '@/components/dashboard/ActionCards';
import Sidebar from '@/components/dashboard/Sidebar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <DashboardHeader />
            <DashboardStats />
            <ActionCards />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
