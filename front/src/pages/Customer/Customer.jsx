// ✅ Customer.jsx - Card View with Search, Filters, Pagination & Avatar
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";

export const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 8;
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const deleteCustomer = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/customers/${id}`);
      setCustomers(customers.filter((customer) => customer.id !== id));
      alert("Client supprimé avec succès !");
    } catch (error) {
      alert("Échec de la suppression du client.");
    }
  };

 const filtered = customers.filter((c) =>
  (c.name?.toLowerCase().includes(searchName.toLowerCase()) ?? false) &&
  (c.address?.toLowerCase().includes(filterCity.toLowerCase()) ?? false)
);

  const paginated = filtered.slice(
    (currentPage - 1) * customersPerPage,
    currentPage * customersPerPage
  );

  const totalPages = Math.ceil(filtered.length / customersPerPage);

  return (
    <div className={`min-h-screen px-6 py-8 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">👥 Liste des Clients</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="🔍 Rechercher nom..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={`px-4 py-2 rounded-lg border w-full ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
          />
          <input
            type="text"
            placeholder="🏘️ Filtrer par adresse..."
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className={`px-4 py-2 rounded-lg border w-full ${isDark ? "bg-gray-800 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
          />
          <Link
            to="/addCustomer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all ${isDark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-white hover:bg-blue-50 text-gray-800"}`}
          >
            <FiPlus /> Ajouter
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginated.map((client) => (
          <div
            key={client.id}
            className={`rounded-xl p-4 shadow-md transition hover:shadow-lg ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-white w-6 h-6">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <p className="text-sm text-gray-400">{client.phone}</p>
              </div>
            </div>
            <p className="text-sm mb-2">📍 {client.address}</p>

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => navigate(`/showCustomer/${client.id}`)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                <FiEye />
              </button>
              <button
                onClick={() => navigate(`/editCustomer/${client.id}`)}
                className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Supprimer ce client ?")) {
                    deleteCustomer(client.id);
                  }
                }}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg ${currentPage === i + 1 ? "bg-blue-600 text-white" : isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Customer;
