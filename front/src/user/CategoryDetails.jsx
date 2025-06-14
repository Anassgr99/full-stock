
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { add } from "./store/cartSlice";

const CategoryDetails = ({ categoryDetails }) => {
  const [quantities, setQuantities] = useState({});
  const customer = JSON.parse(localStorage.getItem("selectedStore")); // Selected store from localStorage
  const [stockQuantities, setStockQuantities] = useState({});
  const dispatch = useDispatch();
  const getstore = localStorage.getItem("store");

// //console.log(getstore,"éééééééééé");

  // Fetch stock quantities from the backend
  useEffect(() => {
    const fetchStockQuantities = async () => {
      try {
        const response = await fetch(
          `https://api.simotakhfid.ma:3000/api/getStockQuantitiesByid/${customer.idStoreSelected}`
        );
        const data = await response.json();

        // Map stock quantities and store_id for quick lookup
        const stockMap = {};
        data.forEach(({ product_id, store_id, quantity }) => {
          stockMap[product_id] = { store_id, quantity };
        });

        setStockQuantities(stockMap);
      } catch (error) {
        //console.error("Error fetching stock quantities:", error);
      }
    };

    fetchStockQuantities();
  }, [customer.idStoreSelected]);

  const increment = (id) => {
    if (stockQuantities[id]?.quantity > 0) {
      setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
  };

  const decrement = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const addItems = (item) => {
    const quantity = quantities[item.id] || 0;
    if (quantity > 0) {
      const newItem = {
        ...item,
        price: item.selling_price * quantity,
        quantity,
      };
      dispatch(add(newItem));
      setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
    }
  };

  return (
<div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-1 max-h-[500px]">
{categoryDetails.map((item) => {
        const stockInfo = stockQuantities[item.id] || {}; // Get stock info for the product
        const isAccessible =
          stockInfo.store_id == getstore; // Check if the product belongs to the selected store
// //console.log(isAccessible,"isAccessible",stockInfo.store_id, "=,", customer.idStoreSelected);

        return (
          <motion.div
            key={item.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ease: "easeOut", duration: 0.5 }}
            whileHover={{ backgroundColor: "#1f2544" }}
            style={{ backgroundColor: "#151a34", color: "#dfe3f4" }}
            className="flex justify-between p-3 h-[150px] cursor-pointer"
          >
            <div
              onClick={() => addItems(item)}
              className="flex flex-col items-start justify-between pl-4 font-bold h-[95px] space-y-5"
            >
              <div>
                <h3>{item.name}</h3>
                <p className="text-xs text-[#818497]">
                  DH{item.selling_price}
                </p>
                <p className="text-xs text-[#818497]">
                  Stock: {stockInfo.quantity || 0}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between">
              {/* Disable buttons if the product's store_id doesn't match the selected store */}
              <svg
                onClick={() => isAccessible && increment(item.id)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`cursor-pointer w-6 h-6 bg-[#0e1227] rounded-sm p-1 ${
                  !isAccessible
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <p className="font-semibold text-2xl">
                {quantities[item.id] || 0}
              </p>
              <svg
                onClick={() => isAccessible && decrement(item.id)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className={`cursor-pointer w-6 h-6 bg-[#0e1227] rounded-sm p-1 ${
                  !isAccessible ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 12h-15"
                />
              </svg>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CategoryDetails;
