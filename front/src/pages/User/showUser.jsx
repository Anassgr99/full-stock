// ✅ ShowUser.jsx – Glassmorphism + Avatar + Badge + Animations
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiUser,
  FiCreditCard,
} from "react-icons/fi";

const ShowUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://5.189.179.133:3000/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        alert("Erreur lors du chargement de l'utilisateur.");
      }
    };
    fetchUser();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const datePart = date.toISOString().split("T")[0];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${datePart} ${hours}:${minutes}`;
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  };

  if (!user) {
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
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 shadow-xl"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FiArrowLeft /> Retour
        </button>

        <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col items-center">
            {user.photo ? (
              <img src={user.photo} alt="user" className="h-28 w-28 object-cover rounded-full border-4 border-white/30" />
            ) : (
              <div className="h-28 w-28 rounded-full bg-blue-600 text-white text-3xl font-bold flex items-center justify-center">
                {getInitials(user.name)}
              </div>
            )}
            <span className="mt-2 text-xs bg-green-500/80 text-white px-3 py-1 rounded-full text-center">Actif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <Info icon={<FiUser />} label="Nom" value={user.name} />
            <Info icon={<FiMail />} label="Email" value={user.email} />
            <Info icon={<FiPhone />} label="Téléphone" value={user.phone} />
            <Info icon={<FiMapPin />} label="Adresse" value={user.address} />
            <Info icon={<FiCreditCard />} label="Banque" value={user.bank_name} />
            <Info icon={<FiUser />} label="Titulaire du compte" value={user.account_holder} />
            <Info icon={<FiCreditCard />} label="Numéro de compte" value={user.account_number} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/10 pt-6 mt-6">
          <Info icon={<FiCalendar />} label="Créé le" value={formatDate(user.created_at)} />
          <Info icon={<FiCalendar />} label="Mis à jour le" value={formatDate(user.updated_at)} />
        </div>
      </motion.div>
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-blue-300">{icon}</div>
    <div>
      <p className="text-sm opacity-70 font-medium">{label}</p>
      <p className="text-md font-semibold leading-tight mt-1">{value || "N/A"}</p>
    </div>
  </div>
);

export default ShowUser;