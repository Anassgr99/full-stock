import React, { useContext, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { ThemeContext } from "../../../context/ThemeContext";

const ExcelOptions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
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
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier d'abord.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadStatus("Uploading...");
      const response = await axios.post("http://5.189.179.133:3000/api/uploadExcel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("Téléchargement réussi !");
      //console.log("Server response:", response.data);
    } catch (error) {
      setUploadStatus("Échec du téléchargement du fichier.");
      //console.error("Error uploading file:", error);
    }
  };

  // Handle downloading the template file
  const handleDownloadTemplate = () => {
    // Ensure your template file exists at /templates/model.xlsx in your public folder.
    window.location.href = "/public/ProduitModule.xlsx";
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
          <FiPlus className="mr-2" size={20} />
          Fichier Excel
        </button>
      </div>

      {isModalOpen && (
  <div
    className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50"
    style={{ zIndex: 1050 }}
  >
    <div
      className={`rounded-lg shadow-lg p-6 w-full max-w-3xl relative ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Fichier Excel</h2>

      {/* Bouton de téléchargement */}
      <button
        onClick={handleDownloadTemplate}
        className={`px-4 py-2 rounded-lg mb-4 transition ${
          theme === "dark"
            ? "bg-blue-600 text-white hover:bg-blue-500"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        Télécharger le modèle Excel
      </button>

      {/* Upload du fichier */}
      <div className="flex flex-col gap-2">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className={`border p-2 rounded-md ${
            theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-black border-gray-300"
          }`}
        />
        <button
          onClick={handleUpload}
          className={`px-4 py-2 rounded-lg transition ${
            theme === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Upload le Fichier Excel
        </button>
        {uploadStatus && <p className="text-sm text-gray-500">{uploadStatus}</p>}
      </div>

      {/* Bouton d'annulation */}
      <div className="flex justify-end mt-4">
        <button
          onClick={closeModal}
          className={`py-2 px-4 rounded transition ${
            theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ExcelOptions;

