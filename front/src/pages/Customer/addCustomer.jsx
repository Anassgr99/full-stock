
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSave } from 'react-icons/fi';
import { ThemeContext } from '../../context/ThemeContext';

const AddCustomer = () => {
  const navigate = useNavigate(); // To redirect after adding a customer
  const { theme } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    name: '',
    email: 'email@gmail.com',
    phone: '',
    address: '',
    photo: 'photo',
    account_holder: 'account holder',
    account_number: '00000000000',
    bank_name: 'bank_name',
  });
  
  // For field-level errors (for required fields)
  const [fieldErrors, setFieldErrors] = useState({});
  // For any submission error
  const [error, setError] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error for the field on change
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission with custom validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['name', 'phone'];
    const newFieldErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === '') {
        newFieldErrors[field] = '*';
      }
    });

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    try {
      await axios.post('http://localhost:3000/api/customers', formData);
      alert('Customer added successfully!');
      navigate('/customer'); // Navigate back to the customers list
    } catch (err) {
      setError('Failed to add customer. Please try again.');
    }
  };

  return (
    <div
      className={`p-8 w-full min-h-screen ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
      }`}
    >
      <div
        className={`p-8 w-full max-w-3xl mx-auto shadow-lg rounded-lg ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
      >
        <h1
          className={`text-4xl mb-8 font-semibold border-b pb-4 ${
            theme === 'dark'
              ? 'text-white border-gray-600'
              : 'text-gray-900 border-gray-300'
          }`}
        >
          Ajouter Client
        </h1>

        {/* Error Message */}
        {error && (
          <div
            className={`mb-6 p-1 rounded-md ${
              theme === 'dark'
                ? 'text-red-400 bg-red-900'
                : 'text-red-500 bg-red-100'
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Nom {fieldErrors.name && <span className="text-red-500 ml-1">{fieldErrors.name}</span>}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full mt-1 p-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.name
                    ? theme === 'dark'
                      ? 'border-red-500 bg-gray-700 text-white'
                      : 'border-red-500 bg-gray-100 text-gray-900'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                }`}
                // Removed HTML required attribute in favor of custom validation
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Telephone {fieldErrors.phone && <span className="text-red-500 ml-1">{fieldErrors.phone}</span>}
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full mt-1 p-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  fieldErrors.phone
                    ? theme === 'dark'
                      ? 'border-red-500 bg-gray-700 text-white'
                      : 'border-red-500 bg-gray-100 text-gray-900'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                }`}
                // Removed HTML required attribute
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className={`block text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full mt-1 p-1 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                }`}
              />
            </div>

            {/* Submit Button */}
            <div className="self-end">
              <label className="invisible block text-sm font-medium">Action</label>
              <button
                type="submit"
                className="w-full mt-1 p-1 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiSave className="inline-block mr-2" />
                Enregistrer le client
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomer;
