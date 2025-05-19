// ✅ Purchases.jsx - Sticky Note Wall with Search & Paper Style Notes
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import DownloadRetournerExcelButton from "./Product/Excel/BackupExcelReturn";

const Purchases = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchProduit, setSearchProduit] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/returns");
        setReturns(response.data.data);
      } catch (error) {
        console.error("Error fetching returns:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReturns();
  }, []);

  const getNoteColor = (i) => {
    const paperStyles = [
      "bg-yellow-100 shadow-md", "bg-pink-100 shadow-md",
      "bg-green-100 shadow-md", "bg-blue-100 shadow-md",
      "bg-purple-100 shadow-md", "bg-red-100 shadow-md"
    ];
    const paperDark = [
      "bg-yellow-800 shadow", "bg-pink-800 shadow",
      "bg-green-800 shadow", "bg-blue-800 shadow",
      "bg-purple-800 shadow", "bg-red-800 shadow"
    ];
    return isDark ? paperDark[i % paperDark.length] : paperStyles[i % paperStyles.length];
  };

  const filteredReturns = returns.filter(item =>
    item.name_produit.toLowerCase().includes(searchProduit.toLowerCase()) &&
    item.store_name.toLowerCase().includes(searchStore.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex gap-2">
          <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
          <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 py-8 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <h2 className="text-3xl font-bold mb-6">🧾 Murs des Retours</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Rechercher par produit"
          value={searchProduit}
          onChange={(e) => setSearchProduit(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
        />
        <input
          type="text"
          placeholder="🏬 Rechercher par magasin"
          value={searchStore}
          onChange={(e) => setSearchStore(e.target.value)}
          className={`px-4 py-2 border rounded-lg ${isDark ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
        />
        <DownloadRetournerExcelButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredReturns.map((item, index) => (
          <div
            key={item.id}
            className={`relative p-4 rounded-xl transform transition hover:-translate-y-1 hover:scale-105 duration-300 ${getNoteColor(index)} border border-dashed border-black`} 
            style={{ minHeight: "180px", fontFamily: "cursive", backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
          >
            <div className="text-sm">
              <p className="mb-1 font-bold">📦 {item.name_produit}</p>
              <p>👤 {item.name_user}</p>
              <p>🏬 {item.store_name}</p>
              <p>📆 {new Date(item.return_date).toLocaleDateString()}</p>
              <p className="mt-2 italic text-xs">📝 {item.note || "Pas de note."}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Purchases;
