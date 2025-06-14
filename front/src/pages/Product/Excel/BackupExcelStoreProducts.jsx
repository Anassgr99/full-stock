// DownloadStoreProductsExcelButton.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import { FiDownload } from "react-icons/fi";
import { ThemeContext } from "../../../context/ThemeContext";

const DownloadStoreProductsExcelButton = () => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleOpen = () => {
    setOpen(true);
    document.body.style.overflow = "hidden";
  };
  const handleClose = () => {
    setOpen(false);
    document.body.style.overflow = "auto";
    setStatus("");
  };

  const download = async () => {
    try {
      setStatus("Téléchargement en cours…");
      const token = localStorage.getItem("token");
      const resp = await axios.get(
        "https://api.simotakhfid.ma:3000/api/downloadStoreProductsExcel",
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "store_products.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus("Téléchargement réussi !");
      setTimeout(() => setStatus(""), 3000);
    } catch (err) {
      console.error(err);
      setStatus("Échec du téléchargement.");
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={`px-4 py-2 rounded transition ${
          theme === "dark"
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-white text-gray-800 hover:bg-gray-100"
        }`}
      >
        <FiDownload className="inline mr-2" />
        Exporter Store Products
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`max-w-md w-full p-6 rounded-lg shadow-lg ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl mb-4">Exporter les produits par magasin</h2>
            <p className="mb-4">
              Cliquez pour télécharger les quantités par magasin.
            </p>
            <button
              onClick={download}
              className="w-full py-2 mb-3 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <FiDownload className="inline mr-2" />
              Télécharger Store Products
            </button>
            {status && <p className="text-center">{status}</p>}
            <div className="flex justify-end">
              <button
                onClick={handleClose}
                className={`py-2 px-4 rounded transition ${
                  theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadStoreProductsExcelButton;
