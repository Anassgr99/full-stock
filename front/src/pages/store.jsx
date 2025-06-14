import React, { useState, useEffect, useContext } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { FiAlertTriangle } from "react-icons/fi";
import EditQuantityForm from "./EditQuantityForm";
import ReduceQuantityForm from "./ReduceQuantityForm";
import { ThemeContext } from "../context/ThemeContext";
import DownloadStoreProductsExcelButton from "./Product/Excel/BackupExcelStoreProducts";

const StoreProductTable = () => {
  const [storeProducts, setStoreProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [reducingProduct, setReducingProduct] = useState(null);
  const { theme } = useContext(ThemeContext);

  const fetchStoreProducts = async () => {
    setLoading(true);
    try {
      const [response, storeResponse] = await Promise.all([
        axios.get("https://api.simotakhfid.ma:3000/api/store-products"),
        axios.get("https://api.simotakhfid.ma:3000/api/stores"),
      ]);
      setStoreProducts(response.data);
      setStores(storeResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoreProducts();
  }, []);

  const openEditQuantityForm = (storeId, productId, currentQuantity) => {
    setEditingProduct({ storeId, productId, currentQuantity });
  };

  const closeEditQuantityForm = () => {
    setEditingProduct(null);
    fetchStoreProducts();
  };

  const openReduceQuantityForm = (storeId, productId, currentQuantity) => {
    setReducingProduct({ storeId, productId, currentQuantity });
  };

  const closeReduceQuantityForm = () => {
    setReducingProduct(null);
    fetchStoreProducts();
  };

  const columns = [
    {
      accessorKey: "product_name",
      header: "Nom du produit",
    },
    {
      accessorKey: "quantity",
      header: "Quantité",
      Cell: ({ row }) => {
        const quantity = row.original.quantity;
        const quantityAlert = row.original.quantity_alert;
        let alertColor = "";
        let icon = null;

        if (quantity > quantityAlert) {
          alertColor = "bg-green-500";
        } else if (quantity >= quantityAlert / 2) {
          alertColor = "bg-yellow-500";
          icon = <FiAlertTriangle className="text-yellow-700" />;
        } else {
          alertColor = "bg-red-500";
          icon = <i className="fi fi-x-circle text-red-500"></i>;
        }

        return (
          <div className={`flex items-center justify-center rounded-2xl h-7 w-7 ${alertColor} font-semibold`}>
            {icon}
            <span className="ml-1">{quantity}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "store_name",
      header: "Nom du magasin",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => {
        const { store_id, product_id, quantity } = row.original;
        return (
          <div className="flex gap-2">
            <button
              className="px-3 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
              onClick={() => openEditQuantityForm(store_id, product_id, quantity)}
            >
              Ajouter
            </button>
            <button
              className="px-3 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
              onClick={() => openReduceQuantityForm(store_id, product_id, quantity)}
            >
              Réduire
            </button>
          </div>
        );
      },
    },
  ];

  if (loading) {
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

  return (
    <>
      <div className={`col-span-12 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"} shadow-lg h-[500px]`}>
        <div className={`col-span-12 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"} shadow-lg`}>
          <h3 className="text-lg p-4 rounded-t-xl font-medium">Produits du magasin</h3>
        </div>
        <div className="flex justify-end space-x-2 mr-4">
          <DownloadStoreProductsExcelButton />
        </div>
        <div className={`col-span-12 p-4 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"} shadow-lg`}>
          <MaterialReactTable
            columns={columns}
            data={storeProducts}
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
      </div>
      {editingProduct && (
        <EditQuantityForm
          storeId={editingProduct.storeId}
          productId={editingProduct.productId}
          currentQuantity={editingProduct.currentQuantity}
          store={stores}
          onClose={closeEditQuantityForm}
        />
      )}
      {reducingProduct && (
        <ReduceQuantityForm
          storeId={reducingProduct.storeId}
          productId={reducingProduct.productId}
          currentQuantity={reducingProduct.currentQuantity}
          onClose={closeReduceQuantityForm}
        />
      )}
    </>
  );
};

export default StoreProductTable;
