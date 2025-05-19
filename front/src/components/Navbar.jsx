import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBox,
  FiShoppingCart,
  FiClipboard,
  FiFileText,
  FiSettings,
  FiGrid,
  FiLogOut,
  FiUser,
  FiUsers,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import { FaFilter, FaStore } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import logo from "../assets/logo.png";

const menuItems = [
  { name: "Dashboard", icon: <FiGrid />, link: "/" },
  { name: "Produits", icon: <FiBox />, link: "/products" },
  { name: "Commandes", icon: <FiShoppingCart />, link: "/orders" },
  { name: "Retours", icon: <FiClipboard />, link: "/purchases" },
  { name: "Clients", icon: <FiUsers />, link: "/customer" },
  { name: "Magasin", icon: <FaStore />, link: "/store" },
  { name: "Vente du jour", icon: <FiFileText />, link: "/ventejour" },
  { name: "Employés", icon: <FiUser />, link: "/user" },
  { name: "Catégories", icon: <FaFilter />, link: "/Showcategories" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isDark = theme === "dark";
  const baseTheme = isDark
    ? "bg-gray-900 text-white"
    : "bg-gray-100 text-black";
  const cardTheme = isDark
    ? "bg-gray-800 text-white hover:bg-gray-700"
    : "bg-white text-gray-800 hover:bg-blue-50";

  return (
    <div
      className={`${
        theme === "dark"
          ? "bg-[#0f172a] text-white"
          : "bg-[#f8fafc] text-gray-900"
      } transition-all duration-500`}
    >
      {/* Header */}
      <nav
        className={`px-6 py-3 flex items-center justify-between shadow-md transition-all duration-500 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Logo Amasys"
            className="w-32 h-10 object-contain"
          />
        </Link>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Toggle thème avec icône */}
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 flex items-center justify-between px-1 rounded-full shadow-inner transition ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <FiMoon
              size={14}
              className={`transition ${
                theme === "dark" ? "text-yellow-400 opacity-100" : "opacity-30"
              }`}
            />
            <FiSun
              size={14}
              className={`transition ${
                theme === "dark" ? "opacity-30" : "text-yellow-500 opacity-100"
              }`}
            />
          </button>

          {/* Badge Pro */}
          <div
            className={`pl-2 py-1 text-xs font-semibold rounded-full shadow border ${
              theme === "dark"
                ? "bg-yellow-500 text-black border-yellow-300"
                : "bg-yellow-400 text-gray-800 border-yellow-300"
            }`}
          >
            Compte Pro
            <span
              className={` ml-1 px-1 py-1 text-xs font-semibold rounded-full shadow border ${
                theme === "dark"
                  ? "bg-red-500 text-black border-red-300"
                  : "bg-red-400 text-gray-800 border-red-300"
              }`}
            >
              Admin
            </span>
          </div>

          {/* Déconnexion */}
          <button
            onClick={handleLogout}
            className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition ${
              theme === "dark"
                ? "bg-gray-800 text-red-400 hover:bg-red-600 hover:text-white"
                : "bg-white text-red-600 hover:bg-red-600 hover:text-white"
            }`}
          >
            <span className="mr-2">Déconnexion</span>
            <FiLogOut size={18} />
          </button>
        </div>
      </nav>

      {/* Menu grid with animated hover */}
      <div className="grid gap-4 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {menuItems.map(({ name, icon, link }) => (
    <Link
      key={name}
      to={link}
      className={`group flex items-center px-4 py-3 rounded-lg shadow-sm text-sm transition-all duration-300 ${
        theme === "dark"
          ? "bg-gray-800 text-white hover:shadow-[0_0_10px_#3b82f6]"
          : "bg-white text-gray-800 hover:shadow-[0_0_10px_#60a5fa]"
      }`}
    >
      <span
        className={`text-lg mr-3 transition-transform group-hover:scale-110 ${
          theme === "dark" ? "text-blue-300" : "text-blue-600"
        }`}
      >
        {icon}
      </span>
      <span className="font-medium">{name}</span>
    </Link>
  ))}
</div>

    </div>
  );
};

export default Navbar;
