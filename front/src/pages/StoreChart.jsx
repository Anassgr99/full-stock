import React, { useState, useEffect, useContext, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import html2pdf from "html2pdf.js";
import { ThemeContext } from "../context/ThemeContext";

// Helper to get last 12 months
const getLast12Months = () => {
  return Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  }).reverse();
};

const StoreChart = () => {
  const { theme } = useContext(ThemeContext);
  const [storeOrdersData, setStoreOrdersData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://5.189.179.133:3000/api/orders", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setStoreOrdersData(data);
          calculateTopProducts(data);
        } else {
          setStoreOrdersData([]);
        }
      } catch (error) {
        setStoreOrdersData([]);
      }
    };

    fetchData();
  }, []);

  const last12Months = useMemo(() => getLast12Months(), []);

  const aggregatedData = useMemo(() => {
    const dataMap = new Map(last12Months.map((month) => [month, {}]));
    storeOrdersData.forEach(({ store_name, order_date }) => {
      const orderMonth = new Date(order_date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (dataMap.has(orderMonth)) {
        dataMap.get(orderMonth)[store_name] =
          (dataMap.get(orderMonth)[store_name] || 0) + 1;
      }
    });
    return last12Months.map((month) => ({ month, stores: dataMap.get(month) }));
  }, [storeOrdersData, last12Months]);

  const calculateTopProducts = (orders) => {
    const productSales = {};
    orders.forEach(({ product_name, store_name, quantity }) => {
      if (product_name && store_name) {
        productSales[store_name] = productSales[store_name] || {};
        productSales[store_name][product_name] =
          productSales[store_name][product_name] || {
            totalSales: 0,
            quantity: 0,
          };
        productSales[store_name][product_name].totalSales += 1;
        productSales[store_name][product_name].quantity += Number(quantity);
      }
    });

    const sortedProducts = Object.entries(productSales).flatMap(
      ([storeName, products]) =>
        Object.entries(products)
          .sort((a, b) => b[1].totalSales - a[1].totalSales)
          .slice(0, 10)
          .map(([productName, { totalSales, quantity }]) => ({
            storeName,
            productName,
            totalSales,
            quantity,
          }))
    );

    setTopProducts(sortedProducts);
  };

  const storeNames = storeOrdersData?.length
    ? [...new Set(storeOrdersData.map((order) => order.store_name))]
    : [];

  const chartSeries = useMemo(
    () =>
      storeNames.map((storeName) => ({
        name: storeName,
        data: aggregatedData.map(
          (monthData) => monthData.stores[storeName] || 0
        ),
      })),
    [storeNames, aggregatedData]
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 350,
        background: theme === "dark" ? "#1F2937" : "#FFFFFF",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: { horizontal: false, columnWidth: "55%", borderRadius: 5 },
      },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ["transparent"] },
      xaxis: {
        categories: last12Months,
        labels: { style: { colors: theme === "dark" ? "#E5E7EB" : "#333" } },
      },
      yaxis: {
        labels: { style: { colors: theme === "dark" ? "#FFFFFF" : "#000000" } },
      },
      legend: {
        position: "top",
        horizontalAlign: "center",
        fontSize: "14px",
        fontWeight: 500,
        labels: { colors: theme === "dark" ? "#E5E7EB" : "#333" },
      },
      tooltip: {
        theme,
        y: { formatter: (val) => `${val} commandes` },
      },
    }),
    [theme, last12Months]
  );

  // 👇 Export Custom Chart
  const exportChartAs = async (type = "png") => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const exportOptions = {
      ...chartOptions,
      chart: {
        ...chartOptions.chart,
        background: "#FFFFFF",
        type: "bar",
        height: 350,
      },
      colors: [type === "pdf" ? "#4B5563" : "#9333EA"],
      tooltip: { enabled: false },
    };

    const chart = new ApexCharts(container, {
      ...exportOptions,
      series: chartSeries,
    });

    await chart.render();

    if (type === "png") {
      const { imgURI } = await chart.dataURI();
      const a = document.createElement("a");
      a.href = imgURI;
      a.download = "store_chart.png";
      a.click();
    } else {
      html2pdf().from(container).save("store_chart.pdf");
    }

    chart.destroy();
    document.body.removeChild(container);
  };

  // 🔥 Rank Badge
  const getBadge = (index) => {
    const base = "text-xs font-bold px-2 py-0.5 rounded-full";
    if (index === 0)
      return <span className={`${base} bg-yellow-400 text-white`}>🥇</span>;
    if (index === 1)
      return <span className={`${base} bg-gray-400 text-white`}>🥈</span>;
    if (index === 2)
      return <span className={`${base} bg-orange-400 text-white`}>🥉</span>;
    return null;
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 📊 Chart */}
      <div
        className={`col-span-7 ${
          theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        } shadow-lg rounded-lg`}
      >
        <div className="flex items-center justify-between p-4">
          <h3 className="text-lg font-medium">
            Aperçu Mensuel des Commandes du Magasin
          </h3>
          {/* <div className="flex gap-2">
            <button
              onClick={() => exportChartAs("png")}
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
              title="Exporter en PNG"
            >
              🖼️ PNG
            </button>
            <button
              onClick={() => exportChartAs("pdf")}
              className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
              title="Exporter en PDF"
            >
              📄 PDF
            </button>
          </div> */}
        </div>
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>

      {/* 🏆 Top Produits */}
      <div
        className={`col-span-5 ${
          theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        } shadow-lg rounded-lg`}
      >
        <h3 className="text-lg p-4 font-medium">Top 10 des Produits Vendus</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="text-left px-4 py-2 text-sm font-semibold">Produit</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Ventes</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Magasin</th>
                <th className="text-left px-4 py-2 text-sm font-semibold">Quantité</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((prod, index) => (
                <tr
                  key={index}
                  className={`${
                    theme === "dark" ? "bg-gray-800" : "bg-white"
                  } hover:bg-gray-300 hover:text-black  dark:hover:bg-gray-600 transition`}
                >
                  <td className="px-4 py-2 text-sm">{prod.productName}</td>
                  <td className="px-4 py-2 text-sm flex items-center gap-2">
                    {getBadge(index)} {prod.totalSales}
                  </td>
                  <td className="px-4 py-2 text-sm">{prod.storeName}</td>
                  <td className="px-4 py-2 text-sm">{prod.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreChart;
