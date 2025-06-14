import React, { useContext, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const ReduceQuantityForm = ({ storeId, productId, currentQuantity, onClose }) => {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const qtyToReduce = Number(quantity);
    if (!qtyToReduce || qtyToReduce <= 0) {
      setError("Quantité doit être supérieure à 0.");
      return;
    }
    if (qtyToReduce > currentQuantity) {
      setError("Quantité à retirer dépasse le stock actuel.");
      return;
    }

    try {
      const response = await axios.post(
        "https://api.simotakhfid.ma/api/store-products/reduce",
        {
          store_id: storeId,
          product_id: productId,
          quantity: qtyToReduce,
        }
      );

      alert(response.data.message || "Quantité réduite avec succès");
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur serveur, veuillez réessayer."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 overflow-hidden"
      style={{ zIndex: 1050 }}
    >
      <div
        className={`rounded-lg shadow-lg p-6 w-full max-w-md relative ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Réduire Quantité (Actuel: {currentQuantity})
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium">
              Quantité à réduire
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`border px-3 py-2 w-full rounded ${
                theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className={`py-2 px-4 rounded ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-500 text-white"
              }`}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`py-2 px-4 rounded ${
                theme === "dark" ? "bg-red-600 text-white" : "bg-red-500 text-white"
              }`}
            >
              Réduire
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReduceQuantityForm;