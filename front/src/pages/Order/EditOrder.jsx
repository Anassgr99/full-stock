import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const EditOrder = () => {
  const [order, setOrder] = useState(null);
  const [paymentType, setPaymentType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`https://api.simotakhfid.ma:3000/api/orders/${id}`);
        setOrder(response.data);
        // Set the default payment type from the backend
        setPaymentType(response.data.payment_type);
      } catch (error) {
        alert(`Failed to fetch order: ${error.response?.data?.message || error.message}`);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdate = async () => {
    if (!paymentType) return alert('Please select a valid status.');

    setIsSubmitting(true);
    try {
      const orderData = { payment_type: paymentType };
      await axios.put(`https://api.simotakhfid.ma:3000/api/orders/${id}`, orderData);
      alert('Order updated successfully!');
      navigate('/orders'); // Redirect to orders page
    } catch (error) {
      alert(`Failed to update order: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) {
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
    <div className={`min-h-screen flex items-center justify-center ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
  <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} shadow-lg rounded-lg p-8 w-full max-w-lg`}>
    <h2 className={`text-2xl font-bold mb-6 text-center ${theme === "dark" ? "text-white" : "text-gray-800"}`}>Edit Order</h2>
    <div className="space-y-4">
      <div>
        <label className={`block font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`} htmlFor="paymentType">
          Type de paiement:
        </label>
        <select
          id="paymentType"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
          disabled={isSubmitting}
          className={`w-full mt-1 px-4 py-2 border rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-white text-gray-700"}`}
        >
          <option value="">Selectioner Type de paiement</option>
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
        </select>
      </div>
      <button
        onClick={handleUpdate}
        disabled={isSubmitting}
        className={`w-full py-2 px-4 rounded-lg text-white font-medium ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : (theme === "dark" ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600')}`}
      >
        {isSubmitting ? 'Updating...' : 'Enregistrer le modification'}
      </button>
    </div>
  </div>
</div>

  );
};

export default EditOrder;