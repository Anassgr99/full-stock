import React, { useEffect, useState, useMemo } from "react";
import { Link , useNavigate} from "react-router-dom";
import { FiSun, FiMoon, FiSearch ,FiLogOut} from "react-icons/fi"; // Importing react-icons
import logo from "../assets/logo.png";

const HomeStore = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("dark"); // Dark/Light theme toggle
  const [search, setSearch] = useState(""); // Search input

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ جلب التوكن
  
        const response = await fetch("https://api.simotakhfid.ma/api/stores", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ إضافة التوكن فـ الهيدر
          },
        });
  
        if (!response.ok) throw new Error("Failed to fetch stores.");
        
        const data = await response.json();
        setStores(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStores();
  }, []);
  
  // Search Filtering
  const filteredStores = useMemo(() => {
    return stores.filter((store) =>
      store.id !== 1 && // Exclude store with id 1
      store.store_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, stores]);

  // Theme Toggle
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } min-h-screen transition-all`}
    >
      {/* Header */}
      <header className="p-2 shadow-lg flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div>
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={logo}
              alt="logo"
              className="w-36 h-12 object-contain"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-all"
          >
            {theme === "dark" ? (
              <FiSun size={24} className="text-yellow-500" />
            ) : (
              <FiMoon size={24} className="text-gray-800" />
            )}
          </button>
          {/* logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center bg-white text-red-600 px-4 py-2 rounded-lg shadow hover:bg-red-600 hover:text-white transition"
          >
            <span className="pr-2">Déconnecter</span>
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </header>
    
      {/* Search Bar */}
      <div className="flex justify-center mt-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search stores..."
            className="w-full p-3 rounded-lg shadow-md text-black focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch
            size={20}
            className="absolute top-3 right-4 text-gray-600"
          />
        </div>

      </div>

      {/* Stores Grid */}
      <div className="container mx-auto p-6">
        {loading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-60 h-40 bg-gray-700 animate-pulse rounded-lg shadow-lg"
              ></div>
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center text-lg">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
                <div
                  key={store.id}
                  className={`p-5 rounded-xl shadow-xl transition transform hover:scale-105 hover:shadow-2xl border border-gray-700 ${
                    index % 2 === 0
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                      : "bg-gradient-to-br from-green-500 to-teal-600"
                  }`}
                >
                  <h2 className="text-2xl font-semibold">{store.store_name}</h2>
                  {/* <p className="text-sm opacity-80">Store ID: {store.id}</p> */}
                  <Link
                    to={`/isUser/${store.id}`}
                    className="mt-4 block text-center bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Voir la boutique
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-lg font-semibold">
                Aucune boutique trouvée.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeStore;
