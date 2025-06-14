// VenteJour.jsx
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
        // 1) Fetch all orders + all products in parallel
        const [ordersResponse, productsResponse] = await Promise.all([
          axios.get("https://api.simotakhfid.ma:3000/api/orders"),
          axios.get("https://api.simotakhfid.ma:3000/api/products"),
        ]);

        const rows = ordersResponse.data;       // array of flattened order→product rows
        const productsData = productsResponse.data; // full product list

        // 2) Build lookup maps for productName and productBuyingPrice:
        const productNameMap = {};
        const productBuyingMap = {};
        productsData.forEach((product) => {
          productNameMap[product.id] = product.name;
          productBuyingMap[product.id] = Number(product.buying_price) || 0;
        });

        // 3) Find "today" in YYYY-MM-DD to filter
        const today = new Date().toISOString().split("T")[0];

        // 4) Only keep the rows whose order_date is today
        const todayRows = rows.filter((row) => {
          // row.order_date might be "2025-05-30T22:50:56.627Z"
          const orderDatePart = row.order_date.split("T")[0];
          return orderDatePart === today;
        });

        // 5) Group by order_id, initialize an order object for each unique order_id
        const ordersById = {};
        const processedOrderIds = new Set(); // Track processed orders to avoid duplicates

        todayRows.forEach((row) => {
          if (!ordersById[row.order_id]) {
            ordersById[row.order_id] = {
              id:              row.order_id,
              customer_name:   row.customer_name || "Client Inconnu",
              total:           Number(row.total) || 0,
              order_store:     row.order_store    || "Inconnu",
              products:        [],     // will fill in next
              totalBuying:     0,      // initialize here
            };
          }
        });

        // 6) Populate each order's `products` array exactly once per order
        todayRows.forEach((row) => {
          const orderId = row.order_id;
          
          // Skip if we've already processed this order
          if (processedOrderIds.has(orderId)) {
            return;
          }
          
          const order = ordersById[orderId];
          
          // Parse the JSON string in row.products (if needed)
          const lineItems = Array.isArray(row.products)
            ? row.products
            : JSON.parse(row.products);

          let orderBuyingTotal = 0;

          // For each product object inside that JSON array:
          lineItems.forEach((prod) => {
            const prodId = prod.product_id;
            const qty = Number(prod.quantity) || 0;

            // Lookup product name (fallback if not in JSON)
            const productName =
              prod.product_name ||
              productNameMap[prodId] ||
              "Non spécifié";

            // Lookup buying_price from our productsResponse
            const buyingPriceFromMap = productBuyingMap[prodId] || 0;

            // Calculate buying cost for this product line
            const productBuyingCost = buyingPriceFromMap * qty;
            orderBuyingTotal += productBuyingCost;

            order.products.push({
              product_id:    prodId,
              product_name:  productName,
              quantity:      qty,
              unitcost:      Number(prod.unitcost) || 0,
              buying_price:  buyingPriceFromMap,
              total_buying_cost: productBuyingCost,
            });
          });

          // Set the total buying cost for this order
          order.totalBuying = orderBuyingTotal;
          
          // Mark this order as processed
          processedOrderIds.add(orderId);
        });

        // 7) Group the orders by store
        const groupedByStore = {};
        Object.values(ordersById).forEach((order) => {
          const storeKey = order.order_store;
          if (!groupedByStore[storeKey]) {
            groupedByStore[storeKey] = [];
          }
          groupedByStore[storeKey].push(order);
        });


        setOrdersByStore(groupedByStore);
        setLoading(false);
      } catch (err) {
        setError(
          "Une erreur s'est produite lors du chargement des commandes."
        );
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

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">{error}</div>
    );
  }

  return (
    <div
      className={`min-h-screen justify-center ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div
        className={`container mx-auto p-8 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h1 className="text-2xl font-bold mb-6">Commandes du Jour</h1>
        {Object.keys(ordersByStore).length === 0 ? (
          <div className="text-center text-gray-500">
            Aucune commande trouvée pour aujourd'hui.
          </div>
        ) : (
          Object.entries(ordersByStore).map(([store, orders]) => {
            // 8) Compute total sales (total) and total buying cost for this store
            const totalSalesForStore = orders.reduce(
              (sum, order) => {
                return sum + Number(order.total);
              },
              0
            );
            
            const totalBuyingForStore = orders.reduce(
              (sum, order) => sum + Number(order.totalBuying),
              0
            );

            const totalProfitForStore = totalSalesForStore - totalBuyingForStore;

            return (
              <div key={store} className="mb-10">
                <h2 className="text-xl font-semibold mb-4">
                  Store #{store}
                </h2>
                <div
                  className={`${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } shadow-md rounded-lg p-6`}
                >
                  <table className="table-auto w-full text-left border-separate border-spacing-0.5">
                    <thead>
                      <tr
                        className={`${
                          theme === "dark"
                            ? "bg-gray-700 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        <th className="py-2 px-4 border border-gray-300">#</th>
                        <th className="py-2 px-4 border border-gray-300">
                          ID Commande
                        </th>
                        <th className="py-2 px-4 border border-gray-300">
                          Client
                        </th>
                        <th className="py-2 px-4 border border-gray-300">
                          Total Ventes
                        </th>
                        <th className="py-2 px-4 border border-gray-300">
                          Total Coût
                        </th>
                        <th className="py-2 px-4 border border-gray-300">
                          Profit
                        </th>
                        <th className="py-2 px-4 border border-gray-300">
                          Action
                        </th>
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

                  {/* 9) Show store‐level totals */}
                  <div className="mt-6 space-y-2">
                    <div className="text-right font-bold text-lg">
                      Total des Ventes pour le store {store} :{" "}
                      <span className="text-green-600">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "MAD",
                        }).format(totalSalesForStore)}
                      </span>
                    </div>
                    <div className="text-right font-bold text-lg">
                      Total du Profit pour le store {store} :{" "}
                      <span className={totalProfitForStore >= 0 ? "text-green-600" : "text-red-600"}>
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "MAD",
                        }).format(totalProfitForStore)}
                      </span>
                    </div>
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

const OrderRow = ({ order, index, onSelect, theme }) => {
  const profit = Number(order.total) - Number(order.totalBuying);
  
  return (
    <tr
      className={`border-b ${
        theme === "dark"
          ? "hover:bg-gray-800"
          : "hover:bg-gray-100"
      } ${
        index % 2 === 0
          ? theme === "dark"
            ? "bg-gray-800"
            : "bg-gray-50"
          : ""
      }`}
    >
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
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MAD",
        }).format(order.totalBuying)}
      </td>
      <td className={`py-2 px-4 ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MAD",
        }).format(profit)}
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
};

const OrderDetailsModal = ({ order, onClose, theme }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white"} rounded-lg p-6 w-96 shadow-xl transform transition-transform scale-95 hover:scale-100 max-h-[80vh] overflow-y-auto`}>
      <h2 className="text-lg font-bold mb-4">Détails de la Commande</h2>
      <p><strong>ID Commande :</strong> {order.id}</p>
      <p><strong>Client :</strong> {order.customer_name}</p>
      <p>
        <strong>Total Vente :</strong>{" "}
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MAD",
        }).format(order.total)}
      </p>
      <p>
        <strong>Total Coût :</strong>{" "}
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "MAD",
        }).format(order.totalBuying)}
      </p>
      <p>
        <strong>Profit :</strong>{" "}
        <span className={(order.total - order.totalBuying) >= 0 ? 'text-green-600' : 'text-red-600'}>
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "MAD",
          }).format(order.total - order.totalBuying)}
        </span>
      </p>
      <h3 className="font-semibold mt-4 mb-2">Produits :</h3>
      <ul className="list-disc pl-6">
        {order.products.length > 0 ? (
          order.products.map((product, index) => (
            <li key={index} className="mb-2">
              <div><strong>Nom :</strong> {product.product_name || "Non spécifié"}</div>
              <div><strong>Quantité :</strong> {product.quantity || 0}</div>
              <div><strong>Prix Unitaire :</strong>{" "}
                {product.unitcost ? new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(Number(product.unitcost)) : <span className="text-red-500">Non spécifié</span>}
              </div>
              <div><strong>Coût d'achat unitaire :</strong>{" "}
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(product.buying_price)}
              </div>
              <div><strong>Coût total d'achat :</strong>{" "}
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "MAD" }).format(product.total_buying_cost)}
              </div>
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