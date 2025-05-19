import React, { useContext, useState } from "react";
import axios from "axios";
import { FiDownload } from "react-icons/fi";
import { ThemeContext } from "../../../context/ThemeContext";

const DownloadOrdersExcelButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");
  const { theme } = useContext(ThemeContext);

  const open = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = "auto";
    setStatus("");
  };

  const download = async () => {
    try {
      setStatus("Téléchargement en cours...");
      const token = localStorage.getItem("token");
      const resp = await axios.get(
        "http://localhost:3000/api/downloadOrdersExcel",
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "orders.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setStatus("Téléchargement réussi !");
      setTimeout(() => setStatus(""), 3000);
    } catch (e) {
      console.error("Download error:", e);
      setStatus("Échec du téléchargement.");
    }
  };

  return (
    <>
      <button
        onClick={open}
        className={`flex items-center px-4 py-2 rounded transition ${
          theme === "dark"
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-white text-gray-800 hover:bg-gray-100"
        }`}
      >
        <FiDownload className="mr-2" />
        Exporter Orders
      </button>

      {isOpen && (
        // Backdrop: full-screen, semi‑transparent, high z‑index
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={close}
        >
          {/* Modal box: stop clicks from closing */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md mx-4 p-6 rounded-lg shadow-lg transition ${
              theme === "dark"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              Exporter les commandes
            </h2>
            <p className="mb-4">
              Cliquez ci‑dessous pour télécharger toutes les commandes en Excel.
            </p>

            <button
              onClick={download}
              className="w-full py-2 mb-3 rounded bg-green-500 text-white hover:bg-green-600 transition"
            >
              <FiDownload className="inline-block mr-2" />
              Télécharger Orders
            </button>

            {status && (
              <p
                className={`text-center mb-3 ${
                  status.includes("réussi")
                    ? "text-green-400"
                    : status.includes("Échec")
                    ? "text-red-400"
                    : "text-gray-500"
                }`}
              >
                {status}
              </p>
            )}

            <div className="flex justify-end">
              <button
                onClick={close}
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

export default DownloadOrdersExcelButton;
