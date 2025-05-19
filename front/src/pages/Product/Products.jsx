import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiShoppingCart,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
  FiBox,
} from "react-icons/fi";
import AddProduct from "../Product/AddProduct";
import UploadExcel from "../Product/Excel/Excel";
import ExcelOptionsFirstTime from "../Product/Excel/ExcelFirstTime";
import DownloadExcelButtonProducts from "../Product/Excel/BackupExcelProducts";
import { ThemeContext } from "../../context/ThemeContext";
import ReactApexChart from "react-apexcharts";

const StatCard = ({ icon, label, value, color }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-2xl shadow-md border ${
        isDark
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-white text-gray-900 border-gray-200"
      }`}
    >
      <div className={`text-2xl ${color}`}>{icon}</div>
      <div>
        <h4 className="text-sm opacity-70">{label}</h4>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://5.189.179.133:3000/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Erreur lors du chargement des produits"));
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`http://5.189.179.133:3000/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Erreur de suppression.");
    }
  };

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) &&
          (minPrice === "" || p.buying_price >= parseFloat(minPrice)) &&
          (minStock === "" || p.quantity >= parseFloat(minStock))
      ),
    [products, search, minPrice, minStock]
  );

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

  const marginData = useMemo(
    () =>
      products.map((p) => {
        const margin = (
          ((p.selling_price - p.buying_price) / p.buying_price) *
          100
        ).toFixed(2);
        return { name: p.name, margin: parseFloat(margin) };
      }),
    [products]
  );

  const chartOptions = {
    chart: {
      type: "bar",
      background: isDark ? "#1F2937" : "#FFFFFF",
      toolbar: { show: true },
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    xaxis: {
      categories: marginData.map((p) => p.name),
      labels: {
        style: { colors: isDark ? "#F9FAFB" : "#1F2937", fontSize: "12px" },
      },
    },
    yaxis: {
      labels: { style: { colors: isDark ? "#F9FAFB" : "#1F2937" } },
      title: {
        text: "% de Marge",
        style: { color: isDark ? "#F9FAFB" : "#1F2937" },
      },
    },
    tooltip: { theme: isDark ? "dark" : "light" },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
    colors: [isDark ? "#60A5FA" : "#3B82F6"],
  };

  const chartSeries = [
    { name: "Marge %", data: marginData.map((p) => p.margin) },
  ];

  const pieOptions = (title) => ({
    chart: { type: "donut", animations: { enabled: true, speed: 800 } },
    labels: products.map((p) => p.name),
    title: {
      text: title,
      style: { fontSize: "16px", color: isDark ? "#FFF" : "#000" },
    },
    legend: {
      show: false,
    },
    tooltip: {
      y: { formatter: (val) => val.toFixed(0) },
    },
    dataLabels: { style: { colors: [isDark ? "#FFF" : "#000"] } },
  });

  const pieQuantity = products.map((p) => p.quantity);
  const pieBuying = products.map((p) => p.buying_price * p.quantity);
  const pieSelling = products.map((p) => p.selling_price * p.quantity);

  return (
    <div
      className={`p-4 space-y-6 min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 Gestion des Produits</h1>
      </div>

      <div
        className="flex flex-wrap gap-2 items-center shadow p-4 rounded-xl border
        ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}"
      >
        <AddProduct />
        <UploadExcel />
        <ExcelOptionsFirstTime />
        <DownloadExcelButtonProducts />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Rechercher..."
          className={`px-3 py-2 rounded border text-sm ${
            isDark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        />
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="Prix min"
          className={`px-3 py-2 rounded border text-sm ${
            isDark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        />
        <input
          type="number"
          value={minStock}
          onChange={(e) => setMinStock(e.target.value)}
          placeholder="Stock min"
          className={`px-3 py-2 rounded border text-sm ${
            isDark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        />
      </div>

      <div
        className={`overflow-x-auto rounded-3xl shadow-xl border ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-300"
        } p-8`}
      >
        <table className="min-w-full text-base">
          <thead
            className={
              isDark
                ? "bg-gradient-to-r from-blue-800 to-indigo-700 text-white"
                : "bg-gradient-to-r from-blue-200 to-indigo-200 text-indigo-900"
            }
          >
            <tr>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-widest">
                Produit
              </th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-widest">
                Code
              </th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-widest">
                Achat
              </th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-widest">
                Vente
              </th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-widest">
                Stock
              </th>
              <th className="px-6 py-3 text-left font-bold uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p, index) => (
              <tr
                key={p.id}
                className={`border-b ${
                  index % 2 === 0
                    ? isDark
                      ? "bg-gray-900"
                      : "bg-gray-100"
                    : isDark
                    ? "bg-gray-800"
                    : "bg-white"
                } hover:bg-indigo-50 transition duration-200 ease-in-out`}
              >
                <td className="px-6 py-3 font-semibold text-indigo-800">
                  {p.name}
                </td>
                <td className="px-6 py-3 font-mono text-blue-700">{p.code}</td>
                <td className="px-6 py-3 text-red-700 font-bold">
                  {p.buying_price} DH
                </td>
                <td className="px-6 py-3 text-green-700 font-bold">
                  {p.selling_price} DH
                </td>
                <td
                  className={`px-6 py-3 ${
                    p.quantity <= 0
                      ? "text-red-700 font-bold"
                      : "text-gray-400 font-semibold"
                  }`}
                >
                  {p.quantity}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate(`/showProduct/${p.id}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-lg"
                    >
                      <FiEye /> Voir
                    </button>
                    <button
                      onClick={() => navigate(`/editProduct/${p.id}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition shadow-lg"
                    >
                      <FiEdit2 /> Modifier
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition shadow-lg"
                    >
                      <FiTrash2 /> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between my-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            ⬅ Précédent
          </button>
          <span className="font-semibold text-indigo-800">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            Suivant ➡
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="col-span-2 rounded-2xl shadow-xl p-4 border border-violet-500">
          <h2 className="text-lg font-semibold mb-4">📈 Marge par produit</h2>
          <ReactApexChart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={300}
          />
        </div>
        <div className="rounded-2xl shadow-xl p-4 border border-blue-500">
          <ReactApexChart
            options={pieOptions("Répartition des quantités")}
            series={pieQuantity}
            type="donut"
            height={300}
          />
        </div>
        <div className="rounded-2xl shadow-xl p-4 border border-green-500">
          <ReactApexChart
            options={pieOptions("Total Achat par produit")}
            series={pieBuying}
            type="donut"
            height={300}
          />
        </div>
        <div className="rounded-2xl shadow-xl p-4 border border-yellow-500">
          <ReactApexChart
            options={pieOptions("Total Vente par produit")}
            series={pieSelling}
            type="donut"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
