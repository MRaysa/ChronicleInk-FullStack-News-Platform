import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Dashboard/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 bg-white shadow-md fixed top-0 left-0 h-full z-20">
        <AdminSidebar />
      </aside>
      <div className="flex flex-col flex-1 ml-64">
        <header className="h-16 bg-white shadow-md fixed top-0 left-64 right-0 z-10 flex items-center px-6 justify-between">
          <h1 className="text-xl font-semibold text-gray-700">
            Admin Dashboard
          </h1>
          <div>
            <span className="text-sm text-gray-500">Welcome, Admin</span>
          </div>
        </header>
        <main className="pt-20 px-6 pb-6 overflow-auto min-h-screen bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
