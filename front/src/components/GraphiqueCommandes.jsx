import { useState, useRef, useContext, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { ThemeContext } from "../context/ThemeContext";

export default function GraphiqueCommandes({ data }) {
  const { theme } = useContext(ThemeContext);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const graphRef = useRef();

  // 🔁 Group commandes par date
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return data.orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      if (filter === "7days") return now - orderDate <= 7 * 24 * 60 * 60 * 1000;
      if (filter === "month") return now.getMonth() === orderDate.getMonth();
      return true;
    });
  }, [data.orders, filter]);

  const grouped = useMemo(() => {
    const result = {};
    filteredOrders.forEach((order) => {
      const date = new Date(order.order_date).toISOString().split("T")[0];
      result[date] = (result[date] || 0) + order.total;
    });
    return result;
  }, [filteredOrders]);

  const categories = Object.keys(grouped);
  const seriesData = Object.values(grouped);
  const orderSeries = [{ name: "Commandes", data: seriesData }];

  // 🎨 Chart options
  const baseOptions = {
    chart: {
      type: "line",
      background: theme === "dark" ? "#1F2937" : "#FFFFFF",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    colors:
      theme === "dark"
        ? ["#60A5F2", "#818CF8"]
        : ["#00B1D8", "#3B82F6"],
        stroke: {
          show: true,
          curve: "smooth",
          width: 4, // يكون سميك شوية
          colors: [theme === "dark" ? "#3B82F6" : "#0284C7"], // خط واضح
        },
        
        fill: {
          type: "solid", // نحيد gradient باش يبان الخط مزيان
        },
        
    markers: {
      size: 5,
      colors: ["white"],
      strokeColors: theme === "dark" ? "#60A5FA" : "#00B4D8",
      strokeWidth: 2,
    },
   
    xaxis: {
      categories,
      labels: {
        style: {
          colors: theme === "dark" ? "#E5E7EB" : "#1F2937",
        },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme === "dark" ? "#E5E7EB" : "#1F2937",
        },
      },
    },
    tooltip: {
      theme,
      y: {
        formatter: (val) => `${val} commandes`,
      },
    },
    legend: {
      position: "top",
      labels: {
        colors: theme === "dark" ? "#E5E7EB" : "#1F2937",
        useSeriesColors: false,
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
    },
  };

  return (
    <div
      className="mt-4 shadow rounded-lg p-4 transition-all"
      style={{
        backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          📈 Graphique des Commandes
          <span
            className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full cursor-help"
            title="Visualise les commandes par date avec options d'exploration."
          >
            ?
          </span>
        </h3>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setShowModal(true)}
            title="Explorer"
            className="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600"
          >
            🔍
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-4 flex-wrap text-xs">
        {["all", "7days", "month"].map((key) => {
          const labels = {
            all: "📆 Tous",
            "7days": "🕒 7 jours",
            month: "📅 Mois en cours",
          };
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full font-medium ${
                filter === key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {labels[key]}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div ref={graphRef}>
        <ReactApexChart
          options={baseOptions}
          series={orderSeries}
          type="line"
          height={220}
        />
      </div>

      {/* Statistiques */}
      <div
  className={`flex flex-wrap gap-4 mt-4 text-xs ${
    theme === "dark" ? "text-gray-300" : "text-gray-600"
  }`}
>
  <div>
    📅 Date la plus active: {categories[0] || "Aucune date"}
  </div>
  <div>📦 Total: {filteredOrders.length} commandes</div>
</div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">🧐 Détails des Commandes</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <ReactApexChart
              options={baseOptions}
              series={orderSeries}
              type="line"
              height={400}
            />
          </div>
        </div>
      )}
    </div>
  );
}
