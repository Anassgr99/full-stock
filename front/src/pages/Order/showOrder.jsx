import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FiFileText,
  FiCalendar,
  FiCreditCard,
  FiShoppingBag,
  FiDollarSign,
  FiX,
} from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";

const ShowOrder = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://5.189.179.133:3000/api/orders/${id}`
        );
        setOrder(response.data);
      } catch (error) {
        //console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${
      date.toISOString().split("T")[0]
    } ${date.getHours()}:${date.getMinutes()}`;
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

  const paymentStyles = {
    Cash: "bg-green-100 text-green-800 border-green-300",
    Credit: "bg-red-100 text-red-800 border-red-300",
    default: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className={`min-h-screen flex justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
    <div
      className={`container mx-auto p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-extrabold mb-8 text-center">
        Détails de la commande
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[{
            label: "Numéro de facture",
            icon: <FiFileText size={20} />,
            value: order?.invoice_no,
          },
          {
            label: "Date de commande",
            icon: <FiCalendar size={20} />,
            value: formatDate(order?.order_date),
          },
          {
            label: "Type de paiement",
            icon: <FiCreditCard size={20} />,
            value: (
              <span
                className={`px-3 py-1 rounded-md border ${
                  paymentStyles[order?.payment_type] || paymentStyles.default
                } font-bold shadow-md`}
              >
                {order?.payment_type}
              </span>
            ),
          },
          {
            label: "Magasin",
            icon: <FiShoppingBag size={20} />,
            value: order?.store_name,
          },
          {
            label: "Total",
            icon: <FiDollarSign size={20} />,
            value: `${order?.total || "0.00"} MAD`,
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 bg-gradient-to-r from-${
              theme === "dark" ? "gray-800" : "white"
            } via-${theme === "dark" ? "gray-700" : "gray-100"} to-${
              theme === "dark" ? "gray-600" : "gray-200"
            } p-6 shadow-xl rounded-xl hover:scale-105 transition-transform duration-300`}
          >
            <span className="text-blue-500">{item.icon}</span>
            <div>
              <strong className="text-lg">{item.label}:</strong>{" "}
              {item.value || "N/A"}
            </div>
          </div>
        ))}
      </div>

      <div
        className={`shadow-lg rounded-lg p-6 mt-8 ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Produits dans la commande
        </h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-6">Produit</th>
              <th className="py-3 px-6">Prix</th>
              <th className="py-3 px-6">Quantité</th>
              <th className="py-3 px-6">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products?.map((product, index) => (
              <tr key={index}>
                <td className="py-3 px-6">{product.product_name}</td>
                <td className="py-3 px-6">{product.unitcost} MAD</td>
                <td className="py-3 px-6">{product.quantity}</td>
                <td className="py-3 px-6">{product.total} MAD</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-6 mt-8">
        <Link
          to="/orders"
          className={`flex items-center px-6 py-3 rounded-lg text-white transition duration-300 ease-in-out transform ${
            theme === "dark"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          <FiX className="mr-2" />
          Annuler
        </Link>
      </div>
    </div>
    </div>
  );
};

export default ShowOrder;
