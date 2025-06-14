import React, { useContext, useState } from "react";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";

const AddCategory = () => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    slug: "",
    icon: "", // Will hold the icon name after upload
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [iconFile, setIconFile] = useState(null);
  // State for field-level errors (for custom validation)
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear the error for the field on change
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setCategoryData({ ...categoryData, [name]: value });
  };

  // When a file is selected, store it and clear any previous error
  const handleIconFileChange = (e) => {
    const file = e.target.files[0];
    setFieldErrors((prev) => ({ ...prev, icon: "" }));
    if (file) {
      setIconFile(file);
    }
  };

  // Helper to compute input classes with error styling
  const inputClasses = (field) => {
    const base = "border px-3 py-2 w-full rounded ";
    const themeClasses =
      theme === "dark"
        ? "bg-gray-700 text-white "
        : "bg-gray-100 text-gray-900 ";
    const borderClass = fieldErrors[field]
      ? "border-red-500"
      : theme === "dark"
      ? "border-gray-600"
      : "border-gray-300";
    return base + themeClasses + borderClass;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Custom validation for required fields
    if (!categoryData.name.trim()) {
      errors.name = "*";
    }
    if (!categoryData.slug.trim()) {
      errors.slug = "*";
    }
    if (!iconFile) {
      errors.icon = "*";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      let iconValue = categoryData.icon; // Initially may be empty

      // If an icon file is selected, upload it first
      if (iconFile) {
        const formData = new FormData();
        formData.append("slug", categoryData.slug); // Append slug first
        formData.append("icon", iconFile); // Then append the file

        // Notice: Do not set the Content-Type header manually when using FormData
        const uploadResponse = await axios.post("https://api.simotakhfid.ma/api/upload", formData);
        iconValue = uploadResponse.data.iconName;
      }

      // Prepare the payload for creating the category;
      // The icon field will now be set to the returned icon name.
      const categoryPayload = { ...categoryData, icon: iconValue };

      // Post the category data to your API
      await axios.post("https://api.simotakhfid.ma/api/categorys", categoryPayload);

      // Reset form fields and close modal
      setIsModalOpen(false);
      document.body.style.overflow = "auto";
      setCategoryData({ name: "", slug: "", icon: "" });
      setIconFile(null);
      setFieldErrors({});
    } catch (error) {
      //console.error("Error adding category:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Re-enable scrolling
  };

  return (
    <div className={`p-6 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <button
        onClick={openModal}
        className={`flex items-center py-2 px-6 rounded-lg shadow-md transition-all ${
          theme === "dark"
            ? "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg"
            : "bg-white text-gray-800 hover:bg-blue-50 hover:shadow-lg"
        }`}
      >
        <FiPlus className="mr-2" size={20} />
        Ajouter une catégorie
      </button>

      {isModalOpen && (
        <div
          className={`fixed inset-0 flex justify-center items-center z-50 overflow-hidden ${
            theme === "dark" ? "bg-gray-800 bg-opacity-75" : "bg-gray-200 bg-opacity-75"
          }`}
          style={{ zIndex: 1050 }}
        >
          <div
            className={`rounded-lg shadow-lg p-6 w-full max-w-lg relative ${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">Ajouter une catégorie</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Name */}
              <div>
                <label
                  htmlFor="name"
                  className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                >
                  Nom de la catégorie{" "}
                  {fieldErrors.name && <span className="text-red-500 ml-1">{fieldErrors.name}</span>}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={categoryData.name}
                  onChange={handleChange}
                  className={inputClasses("name")}
                />
              </div>
              {/* Slug */}
              <div>
                <label
                  htmlFor="slug"
                  className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                >
                  Matricule{" "}
                  {fieldErrors.slug && <span className="text-red-500 ml-1">{fieldErrors.slug}</span>}
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={categoryData.slug}
                  onChange={handleChange}
                  className={inputClasses("slug")}
                />
              </div>
              {/* Icon File */}
              <div>
                <label
                  htmlFor="icon"
                  className={`block text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-800"}`}
                >
                  Icon (File){" "}
                  {fieldErrors.icon && <span className="text-red-500 ml-1">{fieldErrors.icon}</span>}
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    id="icon"
                    onChange={handleIconFileChange}
                    className={inputClasses("icon")}
                  />
                </div>
              </div>
              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Ajouter une catégorie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCategory;
