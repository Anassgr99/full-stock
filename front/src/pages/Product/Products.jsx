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

import { MaterialReactTable } from "material-react-table";
import { Box, IconButton } from "@mui/material";

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
  const itemsPerPage = 400;
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://api.simotakhfid.ma:3000/api/products")
      .then((res) => setProducts(res.data))
      .catch(() => alert("Erreur lors du chargement des produits"));
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await axios.delete(`https://api.simotakhfid.ma:3000/api/products/${id}`);
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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

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
    legend: { show: false },
    tooltip: { y: { formatter: (val) => val.toFixed(0) } },
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
        {/* <input
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
        /> */}
      </div>

      <MaterialReactTable
        columns={[
          {
            accessorKey: "name",
            header: "Produit",
            Cell: ({ cell }) => (
              <span style={{ color: isDark ? "#F1F5F9" : "#1E293B" }}>
                {cell.getValue()}
              </span>
            ),
          },
          {
            accessorKey: "code",
            header: "Code",
            Cell: ({ cell }) => (
              <span style={{ color: isDark ? "#F1F5F9" : "#1E293B" }}>
                {cell.getValue()}
              </span>
            ),
          },
          {
            accessorKey: "buying_price",
            header: "Achat",
            Cell: ({ cell }) => (
              <span className="text-red-700 font-bold">
                {cell.getValue()} DH
              </span>
            ),
          },
          {
            accessorKey: "selling_price",
            header: "Vente",
            Cell: ({ cell }) => (
              <span className="text-green-700 font-bold">
                {cell.getValue()} DH
              </span>
            ),
          },
          {
            accessorKey: "quantity",
            header: "Stock",
            Cell: ({ cell }) => (
              <span
                className={
                  cell.getValue() <= 0
                    ? "text-red-700 font-bold"
                    : "text-gray-400 font-semibold"
                }
              >
                {cell.getValue()}
              </span>
            ),
          },
          {
            accessorKey: "category.name",
            header: "Categorie",
            Cell: ({ cell }) => (
              <span style={{ color: isDark ? "#F1F5F9" : "#1E293B" }}>
                {cell.getValue()}
              </span>
            ),
          },
          {
            accessorKey: "category.icon",
            header: "Brand",
            Cell: ({ cell }) => (
              <span style={{ color: isDark ? "#F1F5F9" : "#1E293B" }}>
                {cell.getValue()}
              </span>
            ),
          },
          {
            header: "Actions",
            Cell: ({ row }) => (
              <Box sx={{ display: "flex", gap: "0.5rem" }}>
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/showProduct/${row.original.id}`)}
                >
                  <FiEye />
                </IconButton>
                <IconButton
                  color="warning"
                  onClick={() => navigate(`/editProduct/${row.original.id}`)}
                >
                  <FiEdit2 />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => deleteProduct(row.original.id)}
                >
                  <FiTrash2 />
                </IconButton>
              </Box>
            ),
          },
        ]}
        data={filtered}
        muiTableHeadCellProps={{
          sx: {
            backgroundColor: isDark ? "#1E293B" : "#E0F2FE",
            color: isDark ? "#F1F5F9" : "#1E293B",
            fontWeight: "bold",
          },
        }}
        muiBottomToolbarProps={{
          sx: {
            backgroundColor: isDark ? "#0F172A" : "#E0F2FE",

            // الجذر ديال التولبار
            color: isDark ? "#F8FAFC" : "#1E293B",

            // النص بحال "Rows per page"
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: isDark ? "#F8FAFC" : "#1E293B",
                fontWeight: 500,
              },

            // الرقم المختار (10 مثلاً)
            "& .MuiSelect-select": {
              color: isDark ? "#F8FAFC" : "#1E293B",
            },

            // السهم ▼
            "& .MuiSelect-icon": {
              color: isDark ? "#F8FAFC" : "#1E293B",
            },

            // الأسهم ← →
            "& .MuiSvgIcon-root": {
              color: isDark ? "#F8FAFC" : "#1E293B",
            },

            // input الداخلي فـ select
            "& .MuiInputBase-root": {
              color: isDark ? "#F8FAFC" : "#1E293B",
            },

            "& .MuiInputBase-input": {
              color: isDark ? "#F8FAFC" : "#1E293B",
            },
          },
        }}
        muiTopToolbarProps={{
          sx: {
            backgroundColor: isDark ? "#0F172A" : "#E0F2FE",
            color: isDark ? "#F1F5F9" : "#1E293B",
          },
        }}
        muiTableBodyProps={{
          sx: {
            backgroundColor: isDark ? "#0F172A" : "#FFF",
          },
        }}
        muiTableBodyRowProps={({ row }) => ({
          sx: {
            backgroundColor:
              row.index % 2 === 0
                ? isDark
                  ? "#1F2937"
                  : "#F3F4F6"
                : isDark
                ? "#374151"
                : "#FFFFFF",
            "&:hover": {
              backgroundColor: isDark ? "#4B5563" : "#E0E7FF",
            },
          },
        })}
        icons={{
          SearchIcon: (props) => (
            <FiSearch {...props} color={isDark ? "#E0F2FE" : "#1E293B"} />
          ),
          ViewColumnIcon: (props) => (
            <FiBox {...props} color={isDark ? "#E0F2FE" : "#1E293B"} />
          ),
          FilterListIcon: (props) => (
            <FiBarChart2 {...props} color={isDark ? "#E0F2FE" : "#1E293B"} />
          ),
          MoreVertIcon: (props) => (
            <FiTrendingUp {...props} color={isDark ? "#E0F2FE" : "#1E293B"} />
          ),
        }}
        muiSearchTextFieldProps={{
          placeholder: "🔍 Rechercher...",
          variant: "outlined",
          InputProps: {
            sx: {
              color: isDark ? "#F8FAFC" : "#1E293B", // لون النص
              "& .MuiSvgIcon-root": {
                color: isDark ? "#E0F2FE" : "#1E293B", // لون الأيقونات الداخلية
              },
            },
          },
          sx: {
            backgroundColor: isDark ? "#1E293B" : "#FFF",
            borderRadius: "8px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#475569" : "#CBD5E1",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#94A3B8" : "#60A5FA",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark ? "#3B82F6" : "#2563EB",
            },
          },
        }}
      />

      {/* <div className="flex items-center justify-between my-6">
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
        </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div
          className={`rounded-2xl shadow-xl p-4 border ${
            isDark
              ? "bg-gray-900 border-violet-700 text-white"
              : "bg-white border-violet-300 text-gray-900"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">📈 Marge par produit</h2>
          {chartSeries[0]?.data?.length ? (
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={300}
            />
          ) : (
            <p className="text-sm italic text-gray-400">
              Aucune donnée disponible
            </p>
          )}
        </div>

        <div
          className={`rounded-2xl shadow-xl p-4 border ${
            isDark
              ? "bg-gray-900 border-blue-700 text-white"
              : "bg-white border-blue-300 text-gray-900"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">
            📊 Répartition des quantités
          </h2>
          <ReactApexChart
            options={pieOptions("")}
            series={pieQuantity}
            type="donut"
            height={300}
          />
        </div>

        <div
          className={`rounded-2xl shadow-xl p-4 border ${
            isDark
              ? "bg-gray-900 border-green-700 text-white"
              : "bg-white border-green-300 text-gray-900"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">
            💰 Total Achat par produit
          </h2>
          <ReactApexChart
            options={pieOptions("")}
            series={pieBuying}
            type="donut"
            height={300}
          />
        </div>

        <div
          className={`rounded-2xl shadow-xl p-4 border ${
            isDark
              ? "bg-gray-900 border-yellow-700 text-white"
              : "bg-white border-yellow-300 text-gray-900"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">
            🛒 Total Vente par produit
          </h2>
          <ReactApexChart
            options={pieOptions("")}
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
