import React from 'react';
import ProfessorSidebar from './ProfessorSidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <ProfessorSidebar />
      <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
