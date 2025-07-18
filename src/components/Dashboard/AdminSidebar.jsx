import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/manage-articles"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          Manage Articles
        </NavLink>
        <NavLink
          to="/admin/mange-users"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          Manage Users
        </NavLink>
        <NavLink
          to="/admin/publisher"
          className={({ isActive }) =>
            `text-sm font-medium ${
              isActive ? "text-blue-600" : "text-gray-600"
            }`
          }
        >
          Add Publisher
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
