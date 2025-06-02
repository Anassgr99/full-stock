import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";
import { FaSortAmountDown, FaSortAmountUp, FaSyncAlt } from "react-icons/fa";

const StockProduct = () => {
  const { theme } = useContext(ThemeContext);
  const [selectedStore, setSelectedStore] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/store-products");
      setStockData(response.data);
    } catch {
      setError("Impossible de récupérer les données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const getBgClass = (qty) => {
    if (qty > 200) return "bg-green-600 text-white hover:bg-green-700";
    if (qty > 100) return "bg-orange-400 text-white hover:bg-orange-500";
    return "bg-red-500 text-white hover:bg-red-600";
  };

  const groupedData = stockData.reduce((acc, item) => {
    if (!acc[item.product_id]) {
      acc[item.product_id] = { product_name: item.product_name, total: 0, stores: {} };
    }
    acc[item.product_id].stores[item.store_name] = item.quantity;
    acc[item.product_id].total += item.quantity;
    return acc;
  }, {});

  const formattedData = Object.entries(groupedData).map(([id, data]) => ({ product_id: id, ...data }));
  const storeNames = [...new Set(stockData.map((item) => item.store_name))];

  const filteredAndSearchedData = formattedData.filter(item =>
    item.product_name.toLowerCase().includes(search.toLowerCase())
  );

  const sortedData = [...filteredAndSearchedData].sort((a, b) => {
    if (selectedStore === "all") return 0;
    return sortOrder === "asc"
      ? (a.stores[selectedStore] || 0) - (b.stores[selectedStore] || 0)
      : (b.stores[selectedStore] || 0) - (a.stores[selectedStore] || 0);
  });

  return (
    <div className="text-xs">
      <div className="flex flex-wrap gap-3 mb-4 items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div className={`p-2 rounded shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <label className="mr-2 font-medium">🏬 Magasin:</label>
            <select
              className={`px-2 py-1 border rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              onChange={(e) => setSelectedStore(e.target.value)}
              value={selectedStore}
            >
              <option value="all">Tous</option>
              {storeNames.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {selectedStore !== "all" && (
            <div className={`p-2 rounded shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
              <label className="mr-2 font-medium">🔢 Tri:</label>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className={`flex items-center gap-2 px-2 py-1 rounded border ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
              >
                {sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />} {sortOrder === "asc" ? "Croissant" : "Décroissant"}
              </button>
            </div>
          )}

          <div className={`p-2 rounded shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <label className="mr-2 font-medium">🔍 Rechercher:</label>
            <input
              type="text"
              placeholder="Nom produit..."
              className={`px-2 py-1 border rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={fetchStockData}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow"
        >
          <FaSyncAlt className="animate-spin-slow" /> Actualiser
        </button>
      </div>

      <div className="overflow-x-auto max-h-[60vh]">
        <table className="min-w-full border border-gray-300 rounded shadow-sm">
          <thead>
            <tr className={theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}>
              <th className="px-3 py-2 border">Produit</th>
              {(selectedStore === "all" ? storeNames : [selectedStore]).map((store, i) => (
                <th key={i} className="px-3 py-2 border">{store}</th>
              ))}
              <th className="px-3 py-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {(selectedStore === "all" ? filteredAndSearchedData : sortedData).map((item, i) => (
              <tr
                key={i}
                className={`text-center ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"}`}
              >
                <td className="px-3 py-2 border font-medium text-left">{item.product_name}</td>
                {(selectedStore === "all" ? storeNames : [selectedStore]).map((store, idx) => (
                  <td key={idx} className={`px-3 py-2 border ${getBgClass(item.stores[store] || 0)}`}>{item.stores[store] || 0}</td>
                ))}
                <td className="px-3 py-2 border font-bold">{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockProduct;
