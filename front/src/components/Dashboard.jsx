  import React, { useState, useEffect, useContext, useMemo } from "react";
  import ReactApexChart from "react-apexcharts";
  import { FiShoppingCart, FiPackage, FiUsers, FiUser } from "react-icons/fi";
  import { FaArrowUp, FaArrowDown } from "react-icons/fa";
  import html2pdf from "html2pdf.js";
  import { ThemeContext } from "../context/ThemeContext";
  import StockProduct from "./StockProduct";
  import StoreChart from "../pages/StoreChart";
  import { Link } from "react-router-dom";
  import GraphiqueCommandes from "./GraphiqueCommandes";

  const Dashboard = () => {
    const { theme } = useContext(ThemeContext);
    const [data, setData] = useState({
      products: [],
      orders: [],
      customers: [],
      users: [],
    });
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem("token");
        const urls = ["store-products", "orders", "customers", "users"].map(
          (endpoint) => `http://localhost:3000/api/${endpoint}`
        );
        const fetchWithAuth = (url) =>
          fetch(url, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json());

        const [products, orders, customers, users] = await Promise.all(
          urls.map(fetchWithAuth)
        );
        setData({ products, orders, customers, users });
      };
      fetchData();
    }, []);

    const filteredProducts = useMemo(() => {
      return data.products
        .filter((p) =>
          p.product_name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) =>
          sortOrder === "asc" ? a.quantity - b.quantity : b.quantity - a.quantity
        );
    }, [data.products, search, sortOrder]);

    const orderSeries = useMemo(
      () => [{ name: "Commandes", data: data.orders.map((o) => o.total) }],
      [data.orders]
    );

    const cards = [
      {
        icon: <FiShoppingCart />,
        title: "Commandes",
        value: data.orders.length,
        color: "text-blue-500",
      },
      {
        icon: <FiPackage />,
        title: "Produits",
        value: data.products.length,
        color: "text-red-500",
      },
      {
        icon: <FiUsers />,
        title: "Clients",
        value: data.customers.length,
        color: "text-orange-500",
      },
      {
        icon: <FiUser />,
        title: "Utilisateurs",
        value: data.users.length,
        color: "text-green-500",
      },
    ];

    const cardStyle =
      theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900";
    const boxStyle =
      theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800";

    return (
      <div
        className={`p-4 text-xs transition-all ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {/* Boutons top */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => setShowHelp(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow cursor-pointer"
          >
            ❔ Aide
          </button>
          <button
            disabled
            onClick={() => {
              const element = document.getElementById("pdf-content");
              html2pdf().from(element).save("dashboard.pdf");
            }}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full  shadow cursor-pointer"
          >
            🖨️ Export PDF
          </button>
        </div>

        {/* PDF Content */}
        <div id="pdf-content">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 mb-4">
            {cards.map((card, i) => (
              <div
                key={i}
                className={`shadow rounded-lg p-3 flex items-center gap-3 ${cardStyle}`}
              >
                <div className={`text-lg ${card.color}`}>{card.icon}</div>
                <div>
                  <h4 className="text-xs font-medium">{card.title}</h4>
                  <p className="text-sm font-bold">{card.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Produits + Stocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className={`shadow rounded-lg p-3 ${boxStyle}`}>
              <h3 className="text-sm font-semibold mb-2">📦 Produits en Stock</h3>
              <StockProduct />
            </div>

            <div className={`shadow rounded-lg p-3 ${boxStyle}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold">🛒 Produits par Magasin</h3>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="text-xs px-2 py-1 rounded border font-medium cursor-pointer hover:scale-105 transition"
                >
                  Trier: {sortOrder === "asc" ? "⬆️" : "⬇️"}
                </button>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔎 Chercher un produit..."
                className="w-full mb-3 px-3 py-2 text-sm rounded border outline-none shadow-sm"
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                {filteredProducts.map((product, i) => (
                  <Link
                    to={`/showProduct/${product.product_id}`}
                    key={i}
                    className={`p-2 rounded-md shadow-sm border transition cursor-pointer ${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-white text-gray-800"
                    }`}
                    title="Cliquez pour voir les détails du produit"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex flex-col w-3/4">
                        <span className="font-medium truncate">
                          {product.product_name}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 mt-1 text-gray-800 rounded-full w-fit font-semibold bg-gray-300">
                          🏬 {product.store_name}
                        </span>
                      </div>
                      {product.quantity < product.quantity_alert ? (
                        <span className="text-red-500 text-[9px] font-bold">
                          ⚠ Faible
                        </span>
                      ) : (
                        <FaArrowUp className="text-green-500 text-xs" />
                      )}
                    </div>
                    <div className="text-right text-[10px] font-semibold opacity-70">
                      Stock: {product.quantity}
                    </div>
                    <div className="w-full h-1 mt-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${Math.min(
                            100,
                            (product.quantity / 200) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Graph commandes */}
          <div className={`mt-4 shadow rounded-lg p-4 ${boxStyle}`}>
          

            <div className="cursor-pointer">
              <GraphiqueCommandes
                data={data}
                orderSeries={orderSeries}
                theme="light"
                onClick={() => console.log("Clicked on the whole chart!")}
              />
            </div>
          </div>

          {/* Graph magasin */}
          <div className={`mt-4 shadow rounded-lg p-4 ${boxStyle}`}>
            <StoreChart />
          </div>
        </div>

        {/* 🆘 Modale Aide */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div
              className={`w-full max-w-md rounded-lg p-6 shadow-lg relative ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              }`}
            >
              <button
                onClick={() => setShowHelp(false)}
                className="absolute top-2 right-3 text-lg font-bold text-gray-500 hover:text-red-500"
              >
                ×
              </button>
              <h2 className="text-lg font-bold mb-4">
                🆘 Aide du tableau de bord
              </h2>
              <ul className="text-sm list-disc space-y-2 pl-4">
                <li>
                  <strong>Recherche :</strong> Tapez un nom de produit pour
                  filtrer.
                </li>
                <li>
                  <strong>Tri :</strong> Utilisez ⬆️ ou ⬇️ pour classer par stock.
                </li>
                <li>
                  <strong>Export PDF :</strong> Télécharger une version
                  imprimable.
                </li>
                <li>
                  <strong>Cliquer sur produit :</strong> Voir détails complets.
                </li>
                <li>
                  <strong>⚠ Faible :</strong> Stock inférieur au seuil.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default Dashboard;
