import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const EditCategory = () => {
  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to hold field-level error messages for custom validation
  const [fieldErrors, setFieldErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`https://api.simotakhfid.ma/api/categorys/${id}`);
        setCategory(response.data);
        setName(response.data.name);
        setSlug(response.data.slug);
        setIcon(response.data.icon);
      } catch (error) {
        alert(`Failed to fetch category: ${error.response?.data?.message || error.message}`);
      }
    };
    fetchCategory();
  }, [id]);

  // Helper function to validate required fields
  const validateFields = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = '*';
    }
    if (!slug.trim()) {
      errors.slug = '*';
    }
    if (!icon.trim()) {
      errors.icon = '*';
    }
    return errors;
  };

  const handleUpdate = async () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      alert('Name, slug, and icon are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryData = { name, slug, icon };
      await axios.put(`https://api.simotakhfid.ma/api/categorys/${id}`, categoryData);
      alert('Category updated successfully!');
      navigate('/ShowCategories'); // Redirect to the categories page
    } catch (error) {
      alert(`Failed to update category: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) {
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

  // Base classes for inputs, with adjustments for dark mode and error styling
  const inputClasses = `w-full mt-1 px-4 py-2 border rounded-lg ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-700'
  }`;
  const errorInputClasses = `w-full mt-1 px-4 py-2 border rounded-lg border-red-500 ${
    theme === 'dark'
      ? 'bg-gray-700 text-white'
      : 'bg-white text-gray-700'
  }`;

  return (
    <div
      className={`min-h-screen flex justify-center ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <div
        className={`shadow-lg rounded-lg p-8 w-full max-w-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <h2
          className={`text-2xl font-bold mb-6 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}
        >
          Modifier la catégorie
        </h2>
        <div className="space-y-4">
          {/* Category Name */}
          <div>
            <label
              className={`block font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Nom de Catégorie: {fieldErrors.name && <span className="text-red-500">{fieldErrors.name}</span>}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={fieldErrors.name ? errorInputClasses : inputClasses}
              disabled={isSubmitting}
            />
          </div>

          {/* Category Slug */}
          <div>
            <label
              className={`block font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Catégorie Slug: {fieldErrors.slug && <span className="text-red-500">{fieldErrors.slug}</span>}
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setFieldErrors((prev) => ({ ...prev, slug: '' }));
              }}
              className={fieldErrors.slug ? errorInputClasses : inputClasses}
              disabled={isSubmitting}
            />
          </div>

          {/* Category Icon */}
          <div>
            <label
              className={`block font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Icone de Catégorie: {fieldErrors.icon && <span className="text-red-500">{fieldErrors.icon}</span>}
            </label>
            <input
              type="text"
              placeholder="Enter icon link or upload a file"
              value={icon}
              onChange={(e) => {
                setIcon(e.target.value);
                setFieldErrors((prev) => ({ ...prev, icon: '' }));
              }}
              className={fieldErrors.icon ? errorInputClasses : inputClasses}
              disabled={isSubmitting}
            />
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const fileUrl = URL.createObjectURL(file);
                  setIcon(fileUrl);
                  setFieldErrors((prev) => ({ ...prev, icon: '' }));
                }
              }}
              className="w-full mt-2"
              disabled={isSubmitting}
            />
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Mise à jour Catégorie'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
