import React, { useContext, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { ThemeContext } from "../../../context/ThemeContext";

const ExcelOptionsFirstTime = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [storeId, setStoreId] = useState("1");        // ← storeId par défaut
  const [uploadStatus, setUploadStatus] = useState("");
  const { theme } = useContext(ThemeContext);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setUploadStatus("");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStoreChange = (e) => {
    setStoreId(e.target.value);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier d'abord.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("storeId", storeId);               // ← on envoie storeId
    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        "http://localhost:3000/api/uploadExcelFirstTime",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setUploadStatus("Téléchargement réussi !");
    } catch (error) {
      setUploadStatus("Échec du téléchargement du fichier.");
      console.error(error);
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
          <FiPlus className="mr-2" size={20} />
          Première Importation
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg shadow-lg w-full max-w-lg ${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
          }`}>
            <h2 className="text-2xl mb-4">Import Excel Produits</h2>

            {/* Sélecteur de magasin */}
            <div className="mb-4">
              <label className="block mb-1">Choisir le magasin :</label>
              <select
                value={storeId}
                onChange={handleStoreChange}
                className={`w-full p-2 rounded border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"
                }`}
              >
                <option value="1">Magasin 1</option>
                <option value="2">Magasin 2</option>
                <option value="3">Magasin 3</option>
              </select>
            </div>

            {/* Upload du fichier */}
            <div className="mb-4">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded">
                Upload
              </button>
              <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded">
                Annuler
              </button>
            </div>

            {uploadStatus && <p className="mt-3">{uploadStatus}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelOptionsFirstTime;
