// ✅ UserCards.jsx – Styled Grid Cards for Users + Filters (Fix TypeError)
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";

const UserCards = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchStore, setSearchStore] = useState("");
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://api.simotakhfid.ma/api/users").then((res) => setUsers(res.data));
  }, []);

  const deleteUser = async (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      try {
        await axios.delete(`https://api.simotakhfid.ma/api/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const filteredUsers = users.filter((user) =>
    (user.name || "").toLowerCase().includes(searchName.toLowerCase()) &&
    (typeof user.store === "string" ? user.store.toLowerCase() : "").includes(searchStore.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-6">👔 Employés (mode carte)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Rechercher par nom..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        />
        <input
          type="text"
          placeholder="🏬 Filtrer par magasin..."
          value={searchStore}
          onChange={(e) => setSearchStore(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`relative rounded-xl p-4 shadow-md transition hover:shadow-lg border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-white w-6 h-6">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="mb-2 text-sm">
              <p><strong>📍 Adresse:</strong> {user.address || "N/A"}</p>
              <p><strong>🏬 Magasin:</strong> {user.store || "N/A"}</p>
              <p><strong>👤 Username:</strong> {user.username || "N/A"}</p>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => navigate(`/showUser/${user.id}`)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                <FiEye />
              </button>
              <button
                onClick={() => navigate(`/editUser/${user.id}`)}
                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCards;