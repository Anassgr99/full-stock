import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ThemeContext } from "../../context/ThemeContext";

const EditProduct = () => {
  const { id } = useParams(); // Get product ID from URL
  const navigate = useNavigate(); // Navigate after successful update
  const { theme } = useContext(ThemeContext);

  // Initial product state
  const [product, setProduct] = useState({
    name: "",
    slug: "",
    code: "",
    quantity: "",
    buying_price: "",
    selling_price: "",
    quantity_alert: "",
    tax: "null",
    tax_type: "null",
    notes: "null",
    product_image: "null",
    category_id: "",
    unit_id: "Null",
  });
  const [units, setUnits] = useState([]); // State to store units data
  const [category, setCategory] = useState([]); // State to store category data

  // For field-level errors (custom validation)
  const [fieldErrors, setFieldErrors] = useState({});

  // Fetch product, category, and unit data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://api.simotakhfid.ma/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        //console.error("Error fetching product:", error);
        alert("Failed to fetch product. Please try again.");
      }
    };
    const fetchUnits = async () => {
      try {
        const response = await axios.get("https://api.simotakhfid.ma/api/unit/");
        setUnits(response.data);
      } catch (error) {
        //console.error("Error fetching units:", error);
      }
    };
    const fetchCategory = async () => {
      try {
        const response = await axios.get("https://api.simotakhfid.ma/api/categorys/");
        setCategory(response.data);
      } catch (error) {
        //console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
    fetchProduct();
    fetchUnits();
  }, [id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear error for the field on change
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setProduct({ ...product, [name]: value });
  };

  // Custom validation on submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Define required fields
    const requiredFields = [
      "name",
      "slug",
      "code",
      "buying_price",
      "selling_price",
      "quantity_alert",
    ];
    const newFieldErrors = {};

    requiredFields.forEach((field) => {
      if (!product[field] || product[field].toString().trim() === "") {
        newFieldErrors[field] = "*";
      }
    });

    // If errors exist, update state and halt submission
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // Create an object excluding fields that should not be updated
    const { id, created_at, updated_at, category_name, unit_name, ...productToUpdate } = product;

    try {
      await axios.put(`https://api.simotakhfid.ma/api/products/${id}`, productToUpdate);
      alert("Product updated successfully!");
      navigate("/products"); // Redirect to the product list
    } catch (error) {
      //console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  // Helper function to compute input classes with error styling
  const inputClasses = (field) => {
    const baseClasses = "border-2 rounded-lg p-2 ";
    const themeClasses =
      theme === "dark" ? "bg-gray-700 text-white " : "bg-gray-100 text-black ";
    const borderClasses = fieldErrors[field]
      ? "border-red-500"
      : theme === "dark"
      ? "border-gray-600"
      : "border-gray-300";
    return baseClasses + themeClasses + borderClasses;
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`shadow-lg rounded-lg p-8 w-full max-w-lg ${
          theme === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>

        <form
          onSubmit={handleSubmit}
          className={`max-w-4xl mx-auto p-6 shadow-md rounded-lg ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col">
              <label className="text-lg font-medium mb-2">
                Nom: {fieldErrors.name && <span className="text-red-500">{fieldErrors.name}</span>}
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                className={inputClasses("name")}
              />
            </div>

            {/* Slug */}
            <div className="flex flex-col">
              <label className="text-lg font-medium mb-2">
                Slug: {fieldErrors.slug && <span className="text-red-500">{fieldErrors.slug}</span>}
              </label>
              <input
                type="text"
                name="slug"
                value={product.slug}
                onChange={handleChange}
                className={inputClasses("slug")}
              />
            </div>

            {/* Code */}
            <div className="flex flex-col">
              <label className="text-lg font-medium mb-2">
                Code: {fieldErrors.code && <span className="text-red-500">{fieldErrors.code}</span>}
              </label>
              <input
                type="text"
                name="code"
                value={product.code}
                onChange={handleChange}
                className={inputClasses("code")}
              />
            </div>

            {/* Buying Price */}
            <div className="flex flex-col">
              <label className="text-lg font-medium mb-2">
                Prix d'achat:{" "}
                {fieldErrors.buying_price && (
                  <span className="text-red-500">{fieldErrors.buying_price}</span>
                )}
              </label>
              <input
                type="number"
                name="buying_price"
                value={product.buying_price}
                onChange={handleChange}
                className={inputClasses("buying_price")}
              />
            </div>

            {/* Selling Price */}
            <div className="flex flex-col">
              <label className="text-lg font-medium mb-2">
                Prix de vente:{" "}
                {fieldErrors.selling_price && (
                  <span className="text-red-500">{fieldErrors.selling_price}</span>
                )}
              </label>
              <input
                type="number"
                name="selling_price"
                value={product.selling_price}
                onChange={handleChange}
                className={inputClasses("selling_price")}
              />
            </div>

            {/* Quantity Alert */}
            <div className="flex flex-col">
              <label className="text-lg font-medium mb-2">
                Alerte de quantité:{" "}
                {fieldErrors.quantity_alert && (
                  <span className="text-red-500">{fieldErrors.quantity_alert}</span>
                )}
              </label>
              <input
                type="number"
                name="quantity_alert"
                value={product.quantity_alert}
                onChange={handleChange}
                className={inputClasses("quantity_alert")}
              />
            </div>

            {/* Category ID */}
            <div className="flex flex-col">
              <label className="text-lg font-medium mb-2">Catégorie:</label>
              <select
                name="category_id"
                value={product.category_id}
                onChange={handleChange}
                className={`border-2 rounded-lg p-2 ${
                  theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300"
                }`}
              >
                <option value="">Selectioner Catégorie</option>
                {category.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.slug}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition"
          >
            Mettre à jour le produit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;


