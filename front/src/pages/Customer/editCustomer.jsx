import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { FiUser, FiPhone, FiMapPin, FiSave } from "react-icons/fi";

const EditCustomer = () => {
  const { id } = useParams(); // Get the customer ID from the URL
  const navigate = useNavigate(); // For navigating after form submission
  const { theme } = useContext(ThemeContext);

  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    email: "",
    photo: "",
    account_holder: "",
    account_number: "",
    bank_name: ""
  });

  // Field-level errors for custom validation (for required fields)
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // Fetch the customer data when the component mounts
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://5.189.179.133:3000/api/customers/${id}`);
        setCustomerData(response.data); // Set the fetched customer data into state
      } catch (error) {
        //console.error("Error fetching customer data", error);
      }
    };
    fetchCustomer();
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Clear the error for the field on change
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setCustomerData({
      ...customerData,
      [name]: value,
    });
  };

  // Handle form submission with custom validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ["name", "phone"];
    const newFieldErrors = {};

    requiredFields.forEach((field) => {
      if (!customerData[field] || customerData[field].trim() === "") {
        newFieldErrors[field] = "*";
      }
    });

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      await axios.put(`http://5.189.179.133:3000/api/customers/${id}`, {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        photo: customerData.photo,
        account_holder: customerData.account_holder,
        account_number: customerData.account_number,
        bank_name: customerData.bank_name
      });

      alert("Customer updated successfully!");
      navigate(`/showCustomer/${id}`); // Redirect to the customer details page after update
    } catch (error) {
      //console.error("Error updating customer", error);
      alert("Failed to update customer.");
    }
  };

  // Helper to determine input classes with error styling
  const getInputClasses = (field, baseClasses, focusClasses) => {
    const errorClasses = fieldErrors[field] ? " border-red-500" : "";
    return `${baseClasses} ${errorClasses} ${fieldErrors[field] ? "" : focusClasses}`;
  };

  return (
    <div
      className={`p-8 w-full min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h1 className="text-3xl mb-6 font-bold flex items-center gap-3">
        <FiUser size={28} className="text-blue-500" />
        Modifier Client
      </h1>

      <form
        onSubmit={handleSubmit}
        className={`space-y-6 p-6 rounded-lg shadow-lg ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Nom */}
        <div>
          <label
            htmlFor="name"
            className="font-medium flex items-center gap-2"
          >
            <FiUser className="text-blue-500" /> Nom{" "}
            {fieldErrors.name && <span className="text-red-500">{fieldErrors.name}</span>}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerData.name}
            onChange={handleInputChange}
            className={getInputClasses(
              "name",
              "w-full p-2 border rounded-md",
              "focus:ring-2 focus:ring-blue-500"
            ) +
              (theme === "dark"
                ? " bg-gray-700 text-white border-gray-600"
                : " bg-gray-100 text-gray-900 border-gray-300")}
            // Removed HTML required attribute in favor of custom validation
          />
        </div>

        {/* Téléphone */}
        <div>
          <label
            htmlFor="phone"
            className="block font-medium flex items-center gap-2"
          >
            <FiPhone className="text-green-500" /> Téléphone{" "}
            {fieldErrors.phone && <span className="text-red-500">{fieldErrors.phone}</span>}
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={customerData.phone}
            onChange={handleInputChange}
            className={getInputClasses(
              "phone",
              "w-full p-2 border rounded-md",
              "focus:ring-2 focus:ring-green-500"
            ) +
              (theme === "dark"
                ? " bg-gray-700 text-white border-gray-600"
                : " bg-gray-100 text-gray-900 border-gray-300")}
            // Removed HTML required attribute
          />
        </div>

        {/* Adresse */}
        <div>
          <label
            htmlFor="address"
            className="block font-medium flex items-center gap-2"
          >
            <FiMapPin className="text-yellow-500" /> Adresse
          </label>
          <textarea
            id="address"
            name="address"
            value={customerData.address}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-yellow-500 ${
              theme === "dark"
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-gray-100 text-gray-900 border-gray-300"
            }`}
          />
        </div>

        {/* Bouton Enregistrer */}
        <button
          type="submit"
          className="w-full py-3 flex items-center justify-center gap-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
        >
          <FiSave size={20} /> Enregistrer la modification
        </button>
      </form>
    </div>
  );
};

export default EditCustomer;
