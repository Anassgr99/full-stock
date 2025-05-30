// ✅ Orders.jsx - Classic style + Advanced Filters + Stats Cards + Dark/Light Payment Mode + Enhanced Filters + Themed Inputs
import React, { useContext, useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiPrinter,
  FiEdit2,
  FiDollarSign,
  FiHash,
  FiUsers,
} from "react-icons/fi";
import { ThemeContext } from "../../context/ThemeContext";
import DownloadOrdersExcelButton from "../Product/Excel/BackupExcelOrders";

const Orders = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const datePart = date.toISOString().split("T")[0];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${datePart} ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/Orders");
        const formattedData = response.data.map((order) => ({
          ...order,
          order_date: formatDate(order.order_date),
        }));
        setProducts(formattedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
 useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/Orders");
      const formattedData = response.data.map((order) => ({
        ...order,
        order_date: formatDate(order.order_date),
      }));

      // Deduplicate by order.id
      const uniqueProducts = Array.from(
        new Map(formattedData.map(order => [order.id, order])).values()
      );

      setProducts(uniqueProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  fetchProducts();
}, []);

  const filteredProducts = products.filter((item) => {
    const matchSearch =
      item.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.invoice_no?.toLowerCase().includes(search.toLowerCase());
    const matchPayment =
      paymentFilter === "All" || item.payment_type === paymentFilter;
    const matchClient =
      selectedClient === "All" || item.customer_name === selectedClient;
    const matchMin = minTotal === "" || Number(item.total) >= Number(minTotal);
    const matchMax = maxTotal === "" || Number(item.total) <= Number(maxTotal);
    const matchDate =
      dateFilter === "" || item.order_date?.startsWith(dateFilter);
    return (
      matchSearch &&
      matchPayment &&
      matchClient &&
      matchMin &&
      matchMax &&
      matchDate
    );
  });

  const totalOrders = products.length;
  const totalCash = products.filter((p) => p.payment_type === "Cash").length;
  const totalCredit = products.filter(
    (p) => p.payment_type === "Credit"
  ).length;
  const totalAmount = products.reduce(
    (sum, p) => sum + Number(p.total || 0),
    0
  );
  const avgAmount =
    totalOrders > 0 ? (totalAmount / totalOrders).toFixed(2) : 0;
  const maxAmount = products.reduce(
    (max, p) => Math.max(max, Number(p.total || 0)),
    0
  );

  const StatCard = ({ icon: Icon, label, value, bg }) => (
    <div
      className={`p-4 rounded-xl shadow flex items-center gap-4 ${bg} text-white`}
    >
      <div className="text-2xl">
        <Icon />
      </div>
      <div>
        <p className="text-sm opacity-80">{label}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );

  const uniqueClients = [...new Set(products.map((p) => p.customer_name))];
  const inputClass = `px-4 py-2 border rounded-lg ${
    isDark
      ? "bg-gray-800 text-white border-gray-600"
      : "bg-white text-gray-900 border-gray-300"
  }`;
  const columns = [
    { accessorKey: "invoice_no", header: "Facture" },
    { accessorKey: "customer_name", header: "Client" },
    {
      accessorKey: "order_date",
      header: "Date",
    },
    {
      accessorKey: "payment_type",
      header: "Paiement",
      Cell: ({ cell }) => {
        const payment = cell.getValue();
        const style = payment === "Cash"
          ? (theme === "dark" ? "bg-green-900 text-green-300" : "bg-green-100 text-green-800")
          : (theme === "dark" ? "bg-red-900 text-red-300" : "bg-red-100 text-red-800");

        return (
          <span className={`text-sm px-3 py-1 border rounded-full font-medium ${style}`}>
            {payment}
          </span>
        );
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      Cell: ({ row }) => (
        <span className="font-semibold">{row.original.total} DH</span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/showOrders/${row.original.id}`)}
            className="px-3 py-1 border border-green-600 text-green-600 hover:bg-green-100 rounded"
          >
            <FiEye />
          </button>
          <button
            onClick={() => navigate(`/editOrder/${row.original.id}`)}
            className="px-3 py-1 border border-blue-600 text-blue-600 hover:bg-blue-100 rounded"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => navigate(`/print/${row.original.id}`)}
            className="px-3 py-1 border border-orange-500 text-orange-500 hover:bg-orange-100 rounded"
          >
            <FiPrinter />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div
      className={`p-6 rounded-xl ${
        isDark ? "bg-[#1f2937] text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">📦 Commandes</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <StatCard
          icon={FiUsers}
          label="Commandes"
          value={totalOrders}
          bg="bg-blue-500"
        />
        <StatCard
          icon={FiDollarSign}
          label="Cash"
          value={totalCash}
          bg="bg-green-500"
        />
        <StatCard
          icon={FiDollarSign}
          label="Crédit"
          value={totalCredit}
          bg="bg-red-500"
        />
        <StatCard
          icon={FiHash}
          label="Total montant"
          value={`${totalAmount} DH`}
          bg="bg-purple-500"
        />
        <StatCard
          icon={FiDollarSign}
          label="Moyenne"
          value={`${avgAmount} DH`}
          bg="bg-indigo-500"
        />
        <StatCard
          icon={FiDollarSign}
          label="Max"
          value={`${maxAmount} DH`}
          bg="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Rechercher facture/client"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className={inputClass}
        >
          <option value="All">Tous les paiements</option>
          <option value="Cash">Cash</option>
          <option value="Credit">Crédit</option>
        </select>

        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className={inputClass}
        >
          <option value="All">Tous les clients</option>
          {uniqueClients.map((client, index) => (
            <option key={index} value={client}>
              {client}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min montant"
          value={minTotal}
          onChange={(e) => setMinTotal(e.target.value)}
          className={inputClass}
        />

        <input
          type="number"
          placeholder="Max montant"
          value={maxTotal}
          onChange={(e) => setMaxTotal(e.target.value)}
          className={inputClass}
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className={inputClass}
        />
        <DownloadOrdersExcelButton />
      </div>

      <MaterialReactTable
        columns={columns}
        data={filteredProducts}
        enableStickyHeader
        enableRowNumbers
        muiTableContainerProps={{
          sx: {
            backgroundColor: isDark ? "#1f2937" : "#FFFFFF",
            color: isDark ? "#F9FAFB" : "#1F2937",
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            fontWeight: "bold",
            fontSize: "16px",
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
            color: isDark ? "#F9FAFB" : "#1F2937",
          },
        }}
        muiTableBodyCellProps={{
          sx: {
            fontSize: "14px",
            backgroundColor: isDark ? "#1f2937" : "#FFFFFF",
            color: isDark ? "#F9FAFB" : "#1F2937",
          },
        }}
      />
    </div>
  );
};

export default Orders;

