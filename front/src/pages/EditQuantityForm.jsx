import React, { useContext, useState } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const EditQuantityForm = ({ storeId, productId, onClose, store }) => {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      if (!quantity || quantity <= 0) {
        setError("Quantity must be greater than 0.");
        return;
      }

      const response = await axios.post(
        "http://5.189.179.133:3000/api/store-products/add",
        {
          store_id: storeId,
          product_id: productId,
          quantity,
        }
      );

      alert(response.data.message || "Quantity updated successfully");
      onClose(); // Close the modal
    } catch (err) {
      //console.error("Error from backend:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50 overflow-hidden"
      style={{ zIndex: 1050 }}
    >
      <div
        className={`rounded-lg shadow-lg p-6 w-full max-w-3xl relative ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-2xl font-bold mb-4">
          Ajouter Quantité pour le Store {storeId}
        </h2>

        {/* Display error messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          {/* <div>
            <label htmlFor="store_id" className="block text-sm font-medium">
              Store
            </label>
            <select
              id="store_id"
              name="store_id"
              className={`border px-3 py-2 w-full rounded ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              }`}
            >
              <option value="">Select a store</option>
              {store.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.store_name}
                </option>
              ))}
            </select>
          </div> */}

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium">
              Quantité
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={`border px-3 py-2 w-full rounded ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              }`}
            />
          </div>
          <div className="col-span-2 flex justify-end space-x-2">
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
                theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
              }`}
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuantityForm;
