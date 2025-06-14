// ✅ ShowCustomer.jsx – Glassmorphism + Icons + Animations (bg updated to gray-900)
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiMail,
} from "react-icons/fi";

const ShowCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const datePart = date.toISOString().split("T")[0];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${datePart} ${hours}:${minutes}`;
  };

  useEffect(() => {
    axios.get(`https://api.simotakhfid.ma:3000/api/customers/${id}`).then((res) => setCustomer(res.data)).catch(() => alert("Erreur lors du chargement."));
  }, [id]);

  if (!customer) {
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
    <div className={`min-h-screen px-6 py-12 flex justify-center items-center ${isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl w-full backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FiArrowLeft /> Retour
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center">👤 Détails du Client</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Info icon={<FiUser />} label="Nom" value={customer.name} color="text-blue-400" />
          <Info icon={<FiPhone />} label="Téléphone" value={customer.phone} color="text-green-400" />
          <Info icon={<FiMail />} label="Email" value={customer.email} color="text-red-400" />
          <Info icon={<FiMapPin />} label="Adresse" value={customer.address} color="text-yellow-400" />
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
          <Info icon={<FiCalendar />} label="Créé le" value={formatDate(customer.created_at)} color="text-purple-400" />
          <Info icon={<FiCalendar />} label="Mis à jour le" value={formatDate(customer.updated_at)} color="text-indigo-400" />
        </div>
      </motion.div>
    </div>
  );
};

const Info = ({ icon, label, value, color }) => (
  <div className="flex items-start gap-3">
    <div className={`mt-1 ${color}`}>{icon}</div>
    <div>
      <p className="text-sm opacity-70 font-medium">{label}</p>
      <p className="text-md font-semibold leading-tight mt-1">{value || "N/A"}</p>
    </div>
  </div>
);

export default ShowCustomer;
