import { Link, NavLink } from "react-router-dom";
import useAuth from "../hook/useAuth";

import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";

const Navbar = () => {
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/user/add-article", label: "Add Articles" },
    { path: "/all-articles", label: "All Articles" },
    { path: "/user/subscription", label: "Subscription" },
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/user/my-articles", label: "My Articles" },
    { path: "/user/premium-articles", label: "Premium Articles" },
    { path: "/profile", label: "My Profile" },
  ];

  const { user, userSignOut } = useAuth();

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NewsWave
        </Link>
        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "hover:text-blue-500"
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        {user ? (
          <div>
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <img
                  src={user.image}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full cursor-pointer object-cover border-[3px] border-blue-600"
                />
              )}
            >
              <DropdownHeader>
                <span className="block text-sm">{user.name}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </DropdownHeader>
              <DropdownDivider />
              <DropdownItem onClick={userSignOut}>Sign out</DropdownItem>
            </Dropdown>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-4 py-1 border border-blue-500 rounded text-blue-500 hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
