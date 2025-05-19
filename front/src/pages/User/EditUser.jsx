// ✅ EditUser.jsx – Creative Glassmorphism UI + UX Feedback + Avatar Preview
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiMapPin, FiImage, FiCreditCard, FiSave, FiArrowLeft } from "react-icons/fi";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    photo: "",
    account_holder: "",
    account_number: "",
    bank_name: ""
  });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${id}`);
        setCustomerData(response.data);
      } catch (error) {
        alert("Erreur de chargement des données.");
      }
    };
    fetchCustomer();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/users/${id}`, customerData);
      alert("Utilisateur mis à jour avec succès !");
      navigate(`/showUser/${id}`);
    } catch (error) {
      alert("Échec de la mise à jour de l'utilisateur.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
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

        <h2 className="text-3xl font-bold mb-6 text-center">✏️ Modifier l'utilisateur</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField icon={<FiUser />} label="Nom" name="name" value={customerData.name} onChange={handleInputChange} />
          <InputField icon={<FiMail />} label="Email" name="email" value={customerData.email} onChange={handleInputChange} type="email" />
          <InputField icon={<FiPhone />} label="Téléphone" name="phone" value={customerData.phone} onChange={handleInputChange} />
          <InputField icon={<FiMapPin />} label="Adresse" name="address" value={customerData.address} onChange={handleInputChange} />
          <InputField icon={<FiImage />} label="Photo (URL)" name="photo" value={customerData.photo} onChange={handleInputChange} />

          {customerData.photo && (
            <div className="col-span-1 flex justify-center items-center">
              <img
                src={customerData.photo}
                alt="Aperçu utilisateur"
                className="h-28 w-28 rounded-full object-cover border border-white/30"
              />
            </div>
          )}

          <InputField icon={<FiUser />} label="Titulaire du compte" name="account_holder" value={customerData.account_holder} onChange={handleInputChange} />
          <InputField icon={<FiCreditCard />} label="Numéro de compte" name="account_number" value={customerData.account_number} onChange={handleInputChange} />
          <InputField icon={<FiCreditCard />} label="Banque" name="bank_name" value={customerData.bank_name} onChange={handleInputChange} />

          <div className="col-span-full">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
            >
              <FiSave /> Enregistrer les modifications
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon, label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="flex items-center gap-2 text-sm mb-1 text-white/80">
      {icon} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-md border border-white/20 bg-white/10 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-blue-400"
      placeholder={label}
    />
  </div>
);

export default EditUser;