import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ThemeContext } from "../context/ThemeContext";

const VenteJour = () => {
  const { theme } = useContext(ThemeContext);
  const [ordersByStore, setOrdersByStore] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrdersAndProducts = async () => {
      try {
        // Fetch orders and all products concurrently
        const [ordersResponse, productsResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/orders"),
          axios.get("http://localhost:3000/api/products")
        ]);

        const rows = ordersResponse.data;
        const productsData = productsResponse.data;

        // Build a lookup object: product id -> product name
        const productMap = {};
        productsData.forEach((product) => {
          productMap[product.id] = product.name;
        });

        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0];

        // Filter rows for orders created today
        const todayRows = rows.filter((row) => {
          const orderDate = row.order_date.split("T")[0];
          return orderDate === today;
        });

        // Process orders by first grouping them by order_id
        const ordersById = {};
        todayRows.forEach(row => {
          if (!ordersById[row.order_id]) {
            ordersById[row.order_id] = {
              id: row.order_id,
              customer_name: row.customer_name || "Client Inconnu",
              total: row.total,
              order_store: row.order_store || "Inconnu",
              products: [],
              // Flag to track if we've processed products for this order
              productsProcessed: false
            };
          }
        });

        // Now process products for each order only once
        todayRows.forEach(row => {
          const order = ordersById[row.order_id];
          
          // Only process products if we haven't already done so for this order
          if (!order.productsProcessed) {
            // Parse the 'products' field from string to JSON if needed
            const products = Array.isArray(row.products)
              ? row.products
              : JSON.parse(row.products);

            // Add products to the order
            products.forEach(product => {
              const productName =
                product.product_name ||
                productMap[product.product_id] ||
                "Non spécifié";

              order.products.push({
                product_id: product.product_id,
                product_name: productName,
                quantity: Number(product.quantity),
                unitcost: product.unitcost || 0,
              });
            });

            // Mark this order as having its products processed
            order.productsProcessed = true;
          }
        });

        // Group orders by store
        const groupedByStore = {};
        Object.values(ordersById).forEach(order => {
          const store = order.order_store;
          if (!groupedByStore[store]) {
            groupedByStore[store] = [];
          }
          
          // Remove the temporary flag before adding to final output
          delete order.productsProcessed;
          
          groupedByStore[store].push(order);
        });

        setOrdersByStore(groupedByStore);
        setLoading(false);
      } catch (err) {
        setError("Une erreur s'est produite lors du chargement des commandes.");
        setLoading(false);
      }
    };

    fetchOrdersAndProducts();
  }, []);

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
    <div className={`min-h-screen justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className={`container mx-auto p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
        <h1 className="text-2xl font-bold mb-6">Commandes du Jour</h1>
        {Object.keys(ordersByStore).length === 0 ? (
          <div className="text-center text-gray-500">Aucune commande trouvée pour aujourd'hui.</div>
        ) : (
          Object.entries(ordersByStore).map(([store, orders]) => {
            // Calculate total sales per store
            const totalForStore = orders.reduce((sum, order) => sum + order.total, 0);
            return (
              <div key={store} className="mb-10">
                <h2 className="text-xl font-semibold mb-4">Store #{store}</h2>
                <div className={`${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-md rounded-lg p-6`}>
                  <table className="table-auto w-full text-left border-separate border-spacing-0.5">
                    <thead>
                      <tr className={`${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`}>
                        <th className="py-2 px-4 border border-gray-300">#</th>
                        <th className="py-2 px-4 border border-gray-300">ID Commande</th>
                        <th className="py-2 px-4 border border-gray-300">Client</th>
                        <th className="py-2 px-4 border border-gray-300">Total</th>
                        <th className="py-2 px-4 border border-gray-300">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          index={index}
                          onSelect={() => setSelectedOrder(order)}
                          theme={theme}
                        />
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right font-bold text-lg mt-4">
                    Total des ventes pour le store {store} :{" "}
                    {new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "MAD",
                    }).format(totalForStore)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
};

const OrderRow = ({ order, index, onSelect, theme }) => (
  <tr className={`border-b ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"} ${index % 2 === 0 ? (theme === "dark" ? "bg-gray-800" : "bg-gray-50") : ""}`}>
    <td className="py-2 px-4">{index + 1}</td>
    <td className="py-2 px-4">{order.id}</td>
    <td className="py-2 px-4">{order.customer_name}</td>
    <td className="py-2 px-4">
      {new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "MAD",
      }).format(order.total)}
    </td>
    <td className="py-2 px-4">
      <button
        onClick={onSelect}
        className="bg-blue-500 text-white py-2 px-4 rounded transition-transform transform hover:scale-105 hover:bg-blue-700"
      >
        Voir
      </button>
    </td>
  </tr>
);

const OrderDetailsModal = ({ order, onClose, theme }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"} rounded-lg p-6 w-96 shadow-xl transform transition-transform scale-95 hover:scale-100 max-h-[80vh] overflow-y-auto`}>
      <h2 className="text-lg font-bold mb-4">Détails de la Commande</h2>
      <p><strong>ID Commande :</strong> {order.id}</p>
      <p><strong>Client :</strong> {order.customer_name}</p>
      <p>
        <strong>Total :</strong>{" "}
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MAD",
        }).format(order.total)}
      </p>
      <h3 className="font-semibold mt-4 mb-2">Produits :</h3>
      <ul className="list-disc pl-6">
        {order.products.length > 0 ? (
          order.products.map((product, index) => (
            <li key={index}>
              <strong>ID Produit :</strong> {product.product_id || "Non spécifié"},{" "}
              <strong>Nom du produit :</strong> {product.product_name || "Non spécifié"},{" "}
              <strong>Quantité :</strong> {product.quantity || 0},{" "}
              <strong>Prix Unitaire :</strong>{" "}
              {product.unitcost ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(Number(product.unitcost)) : <span className="text-red-500">Non spécifié</span>}
            </li>
          ))
        ) : (
          <li>Aucun produit trouvé pour cette commande.</li>
        )}
      </ul>
      <div className="mt-6 text-right">
        <button onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition-transform transform hover:scale-105">
          Fermer
        </button>
      </div>
    </div>
  </div>
);

export default VenteJour;