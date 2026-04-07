import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const { user, logout } = useAuth();
  const { menuOpen, setMenuOpen } = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/*Logo/App Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg
              xmlns="http://source-to-logo"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a 2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-800 dark:text-white tracking-tight">
            TaskManager
          </span>
        </div>

        {/*Desktop Right Side */}
        <div className="hidden sm:flex items-center gap-3">
          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Hello 👋🏻,{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {user.name}
              </span>
            </span>
          )}

          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors duration-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div>

        {/*Mobile: theme toggle + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              //Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/*Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 flex flex-col gap-3">
          {user && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Hello 👋🏻,{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                {user.name}
              </span>
            </p>
          )}
          <button
            onClick={handleLogout}
            className="flex item-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors duration-200 cursor-pointer w-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
