import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSave } from 'react-icons/fi';

const AddCustomer = () => {
  const navigate = useNavigate(); // To redirect after adding a customer
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    account_holder: '',
    account_number: '',
    bank_name: '',
  });
  const [error, setError] = useState(null);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://5.189.179.133:3000/api/customers', formData);
      alert('Customer added successfully!');
      navigate('/customer'); // Navigate back to the customers list
    } catch (err) {
      //console.error('Error adding customer:', err);
      setError('Failed to add customer. Please try again.');
    }
  };

  return (
    <div className="p-8 bg-gray-50 w-full">
      <h1 className="text-3xl mb-6 text-gray-800">Add Customer</h1>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-gray-700">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Photo */}
        <div>
          <label htmlFor="photo" className="block text-gray-700">Photo (URL)</label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Account Holder */}
        <div>
          <label htmlFor="account_holder" className="block text-gray-700">Account Holder</label>
          <input
            type="text"
            id="account_holder"
            name="account_holder"
            value={formData.account_holder}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Account Number */}
        <div>
          <label htmlFor="account_number" className="block text-gray-700">Account Number</label>
          <input
            type="text"
            id="account_number"
            name="account_number"
            value={formData.account_number}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Bank Name */}
        <div>
          <label htmlFor="bank_name" className="block text-gray-700">Bank Name</label>
          <input
            type="text"
            id="bank_name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <FiSave /> {/* Save Icon */}
            Save Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
