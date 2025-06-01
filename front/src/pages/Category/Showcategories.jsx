import React, { useContext, useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import AddCategory from "../Category/AddCategory"; // Component for adding categories
import { ThemeContext } from "../../context/ThemeContext";

const Showcategories = () => {
  const [products, setProducts] = useState([]); // State to store products
  const navigate = useNavigate(); // Hook for navigation
  const { theme } = useContext(ThemeContext);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://5.189.179.133:3000/api/categorys");
        setProducts(response.data); // Set fetched products
        //console.log(response.data);
      } catch (error) {
        //console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Delete product by ID
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://5.189.179.133:3000/api/categorys/${id}`);
      const response = await axios.get("http://5.189.179.133:3000/api/categorys");
      setProducts(response.data); // Update state with the new data

      alert("Category deleted successfully!");
    } catch (error) {
      //console.error("Error deleting Category:", error);
      window.location.reload();
    }
  };

  // Define columns for the table
  const columns = [
    {
      accessorKey: "id",
      header: "IDENTIFIANT",
    },
    {
      accessorKey: "name",
      header: "NOM",
    },
    {
      accessorKey: "slug",
      header: "MATRICUL",
    },
    {
      accessorKey: "icon",
      header: "Icon",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/editCategory/${row.original.id}`)} // Navigate to edit category page
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2"
          >
            <FiEdit2 /> Modifier
          </button>
          <button
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this category?")
              ) {
                deleteProduct(row.original.id);
              }
            }}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg flex items-center gap-2"
          >
            <FiTrash2 /> Supprimer
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div
          className={`col-span-12  ${
            theme === "dark"
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-800"
          } shadow-lg `}
        >
          <h3 className="text-lg p-4 rounded-t-xl  font-medium">Categories</h3>
          <div className="flex justify-end space-x-2 mr-4">
            <AddCategory
              className={`flex items-center py-2 px-6 rounded-lg shadow-md transition-all ${
                theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-lg"
                  : "bg-white text-gray-800 hover:bg-blue-50 hover:shadow-lg"
              }`}
            />
          </div>
        </div>
      </div>
      <div
        className={`col-span-12 p-4  ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        } shadow-lg `}
      >
        <MaterialReactTable
          columns={columns}
          data={products}
          enableStickyHeader
          enableRowNumbers
          muiTableContainerProps={{
            sx: {
              backgroundColor: theme === "dark" ? "#111827" : "#FFFFFF",
              color: theme === "dark" ? "#F9FAFB" : "#1F2937",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "12px",
              overflow: "auto",
            },
          }}
          muiTableBodyCellProps={{
            sx: {
              fontSize: "14px",
              padding: "12px",
              backgroundColor: theme === "dark" ? "#111827" : "#FFFFFF",
              color: theme === "dark" ? "#F9FAFB" : "#1F2937",
            },
          }}
          muiTableHeadCellProps={{
            sx: {
              fontWeight: "bold",
              fontSize: "16px",
              padding: "14px",
              backgroundColor: theme === "dark" ? "#1F2937" : "#F3F4F6",
              color: theme === "dark" ? "#F9FAFB" : "#1F2937",
            },
          }}
          muiColumnActionsButtonProps={{
            sx: {
              backgroundColor: theme === "dark" ? "#111827" : "#F3F4F6",
              color: theme === "dark" ? "#F9FAFB" : "#1F2937",
            },
          }}
          muiTopToolbarProps={{
            sx: {
              backgroundColor: theme === "dark" ? "#535C91" : "#F3F4F6",
              color: theme === "dark" ? "#F9FAFB" : "#1F2937",
            },
          }}
          muiBottomToolbarProps={{
            sx: {
              backgroundColor: theme === "dark" ? "#535C91" : "#F3F4F6",
              color: theme === "dark" ? "#F9FAFB" : "#1F2937",
            },
          }}
        />
      </div>
    </>
  );
};

export default Showcategories;
