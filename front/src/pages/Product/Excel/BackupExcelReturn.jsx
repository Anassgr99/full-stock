import React, { useContext, useState } from "react";
import axios from "axios";
import { FiDownload } from "react-icons/fi";
import { ThemeContext } from "../../../context/ThemeContext"; // adjust the path as needed

const DownloadRetournerExcelButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const { theme } = useContext(ThemeContext);

  // Open modal and disable background scrolling
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  // Close modal and re-enable background scrolling
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    // Clear status when closing modal
    setDownloadStatus("");
  };

  // Handle downloading retourner Excel file
  const handleDownloadRetourner = async () => {
    try {
      setDownloadStatus("Téléchargement en cours...");
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      
      const response = await axios({
        url: "http://localhost:3000/api/downloadRetournerExcel", // new route
        method: "GET",
        responseType: "blob", // Important for handling file downloads
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "retourner.xlsx");
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setDownloadStatus("Téléchargement réussi !");
      setTimeout(() => setDownloadStatus(""), 3000); // Clear status after 3 seconds
    } catch (error) {
      setDownloadStatus("Échec du téléchargement.");
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="p-3">
      <div>
        <button
          onClick={openModal}
          className={`flex items-center py-2 px-6 rounded-lg shadow-md transition-all ${
            theme === "dark"
              ? "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg"
              : "bg-white text-gray-800 hover:bg-blue-50 hover:shadow-lg"
          }`}
        >
          <FiDownload className="mr-2" size={20} />
          Exporter Retourner Excel
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
          style={{ zIndex: 1050 }}
        >
          <div
            className={`rounded-lg shadow-lg p-6 w-full max-w-md relative ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Exporter les données de retourner</h2>
            <div className="mb-6">
              <p className="mb-4">
                Cliquez sur le bouton ci-dessous pour télécharger tous les retours au format Excel.
              </p>
              <button
                onClick={handleDownloadRetourner}
                className={`w-full px-4 py-3 rounded-lg flex items-center justify-center transition ${
                  theme === "dark"
                    ? "bg-green-600 text-white hover:bg-green-500"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                <FiDownload className="mr-2" size={20} />
                Télécharger Retourner
              </button>
              {downloadStatus && (
                <p
                  className={`text-center mt-3 ${
                    downloadStatus.includes("réussi")
                      ? "text-green-500"
                      : downloadStatus.includes("échec")
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {downloadStatus}
                </p>
              )}
            </div>
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
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
    </div>
  );
};

export default DownloadRetournerExcelButton;
