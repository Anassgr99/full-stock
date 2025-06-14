import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const AddUser = () => {
  const [stores, setStores] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // For success alert
  const [validationErrors, setValidationErrors] = useState({}); // For field-specific errors
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    email_verified_at: null,
    remember_token: null,
    isAdmin: 0,
    store_id: "",
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get("https://api.simotakhfid.ma:3000/api/stores");
        setStores(response.data);
      } catch (error) {
        //console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setValidationErrors({ ...validationErrors, [name]: "" }); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const errors = {};
    if (!userData.name) errors.name = "Le nom est obligatoire.";
    if (!userData.username) errors.username = "Le nom d'utilisateur est obligatoire.";
    if (!userData.email) errors.email = "L'email est obligatoire.";
    if (!userData.password) errors.password = "Le mot de passe est obligatoire.";
    if (!userData.store_id) errors.store_id = "Veuillez sélectionner un magasin.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const response = await axios.post("https://api.simotakhfid.ma:3000/api/users", userData);
      setAlertMessage("Employé ajouté avec succès !");
      //console.log("User added successfully:", response.data);

      setIsModalOpen(false); // Close the modal immediately after adding the user
      navigate("/user"); // Navigate to the user page
    } catch (error) {
      //console.error("Error adding user:", error);
      setAlertMessage("Une erreur est survenue lors de l'ajout de l'employé.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValidationErrors({}); // Clear validation errors on close
  };

  const closeAlert = () => {
    setAlertMessage(null); // Close the alert message
  };

  return (
    <div className="p-6">
      {alertMessage && (
        <div
          className="p-4 absolute top-10 w-full left-1/2 transform -translate-x-1/2 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
          role="alert"
        >
          {alertMessage}
          <button
            onClick={closeAlert}
            className="absolute top-0 right-0 text-4xl text-blue-800 dark:text-blue-400 hover:text-blue-600"
          >
            &times;
          </button>
        </div>
      )}

      <button
        onClick={openModal}
        className="flex items-center justify-center bg-transparent text-green-950 font-bold py-2 px-4 rounded-md border border-blue-500 hover:bg-blue-300 hover:text-black transition duration-300 shadow-[0_0_10px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,1),0_0_30px_rgba(59,130,246,1)]"

      >
        <FiPlus className="mr-2" size={20} />
        Ajouter Employé
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Ajouter un Employé</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
              {/* Form Fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  className={`border px-3 py-2 w-full rounded ${validationErrors.name ? "border-red-500" : ""}`}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  className={`border px-3 py-2 w-full rounded ${validationErrors.username ? "border-red-500" : ""}`}
                />
                {validationErrors.username && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.username}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  className={`border px-3 py-2 w-full rounded ${validationErrors.email ? "border-red-500" : ""}`}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  className={`border px-3 py-2 w-full rounded ${validationErrors.password ? "border-red-500" : ""}`}
                />
                {validationErrors.password && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="store_id" className="block text-sm font-medium">Magasin</label>
                <select
                  id="store_id"
                  name="store_id"
                  value={userData.store_id}
                  onChange={handleChange}
                  className={`border px-3 py-2 w-full rounded ${validationErrors.store_id ? "border-red-500" : ""}`}
                >
                  <option value="">Sélectionner un magasin</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.store_name}
                    </option>
                  ))}
                </select>
                {validationErrors.store_id && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.store_id}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="col-span-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddUser;
