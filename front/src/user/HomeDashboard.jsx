import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiMoon,
  FiSearch,
  FiSun,
  FiTrash,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import logo from "../assets/logo.png";
// -----------------
// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.find(
        (item) =>
          item.id === action.payload.product_id || item.id === action.payload.id
      );
      const product = action.payload;
      const maxQuantity = product.quantity;
      if (existingItem) {
        if (existingItem.quantity < maxQuantity) {
          return state.map((item) =>
            item.id === product.product_id || item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        toast.error("Cannot add more than available stock.");
        return state;
      }
      return [
        ...state,
        { ...product, id: product.product_id || product.id, quantity: 1 },
      ];
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload);
    case "UPDATE_QUANTITY":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    case "UPDATE_PRICE":
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, selling_price: action.payload.selling_price }
          : item
      );
    case "CLEAR_CART":
      return [];
    default:
      return state;
  }
};

// -----------------
// ProductCard Component (without per-product return button)
const ProductCard = ({ product, dispatch, cart = [], theme }) => {
  const handleAddToCart = () => {
    const existingItem = cart.find((item) => item.id === product.id);
    const maxQuantity = product.quantity;
    if (existingItem && existingItem.quantity >= maxQuantity) {
      toast.error("Vous ne pouvez pas ajouter plus de cet article au panier.");
      return;
    }
    if (product.quantity === 0) {
      toast.error("Ce produit est en rupture de stock.");
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md transition transform hover:scale-105 ${
        theme === "dark"
          ? "bg-gray-800 text-white border border-gray-700"
          : "bg-white text-black border border-gray-200"
      }`}
    >
      <h3 className="text-sm font-bold mb-1 line-clamp-2">
        {product.product_name}
      </h3>
      <p
        className={`font-semibold mb-1 text-sm ${
          theme === "dark" ? "text-yellow-400" : "text-blue-500"
        }`}
      >
        {product.selling_price} MAD
      </p>
      <p
        className={`font-semibold mb-2 text-sm ${
          theme === "dark" ? "text-yellow-400" : "text-blue-500"
        }`}
      >
        {product.quantity} Qts
      </p>
      <button
        onClick={handleAddToCart}
        className={`w-full px-3 py-2 rounded text-xs transition duration-200 ${
          product.quantity === 0 ||
          cart.some(
            (item) =>
              item.id === product.id && item.quantity >= product.quantity
          )
            ? "bg-gray-400 cursor-not-allowed"
            : theme === "dark"
            ? "bg-green-600 hover:bg-green-500 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
        }`}
        disabled={
          product.quantity === 0 ||
          cart.some(
            (item) =>
              item.id === product.id && item.quantity >= product.quantity
          )
        }
      >
        Ajouter au panier
      </button>
    </div>
  );
};

// -----------------
// CategoryCard Component
const CategoryCard = ({ category, isActive, onSelectCategory, theme }) => (
  <button
    onClick={() => onSelectCategory(category.id)}
    className={`px-4 py-2 m-1 rounded-lg transition ${
      isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
    } ${
      theme === "dark"
        ? "bg-gray-700 text-white hover:bg-gray-700"
        : "hover:bg-blue-600"
    }`}
  >
    {category.name}
  </button>
);

// -----------------
// CalculatorCard Component
const CalculatorCard = ({
  input,
  setInput,
  handleUpdateQuantity,
  handleUpdatePrix,
  theme,
}) => {
  const handleButtonClick = (value) => {
    if (value === "⌫") {
      setInput((prev) => prev.slice(0, -1));
    } else if (value === "Qté") {
      handleUpdateQuantity(input);
    } else if (value === "Prix") {
      handleUpdatePrix(input);
    } else if (!isNaN(value) || value === "0") {
      setInput((prev) => prev + value);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-md transition ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
        className={`w-full p-2 border rounded text-right text-lg mb-2 transition ${
          theme === "dark"
            ? "bg-gray-900 text-white border-gray-600"
            : "bg-gray-100 text-black border-gray-300"
        }`}
      />
      <div className="grid grid-cols-4 gap-2">
        {[
          1,
          2,
          3,
          "Qté",
          4,
          5,
          6,
          "%",
          7,
          8,
          9,
          "Prix",
          "+/-",
          0,
          ",",
          "⌫",
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(item)}
            className={`p-4 text-lg font-semibold rounded transition duration-200 ${
              item === "Prix"
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : item === "+/-"
                ? "bg-yellow-500 text-black hover:bg-yellow-600"
                : item === ","
                ? "bg-red-500 text-white hover:bg-red-600"
                : theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

// -----------------
// Cart Component (with Bulk Return Modal)
const Cart = ({ cart, dispatch, handlePayment, product, theme }) => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [input, setInput] = useState("");
  const [quantityMode, setQuantityMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  // State variables for Return Modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnNote, setReturnNote] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.selling_price * item.quantity,
    0
  );

  // this useEffect to fetch customers on component mount
  useEffect(() => {
    axios
      .get("http://5.189.179.133:3000/api/customers")
      .then((response) => {
        setCustomers(response.data);
        // Set default customer to first in list (id 1)
        if (response.data.length > 0) {
          const defaultCustomer = response.data.find((c) => c.id === 1);
          setSelectedCustomer(defaultCustomer || response.data[0]);
        }
      })
      .catch((error) => console.error("Error fetching customers:", error));
  }, []); // Empty dependency array = runs once on mount
  useEffect(() => {
    if (showModal) {
      axios
        .get("http://5.189.179.133:3000/api/customers")
        .then((response) => setCustomers(response.data))
        // .catch((error) => console.error("Error fetching customers:", error));
    }
  }, [showModal]);
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpdateQuantity = (input) => {
    const quantity = parseInt(input, 10);
    if (selectedItemId !== null && !isNaN(quantity) && quantity > 0) {
      const originalProduct = product.find(
        (item) => item.product_id === selectedItemId
      );
      if (quantity <= originalProduct.quantity) {
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { id: selectedItemId, quantity },
        });
        setInput("");
        setQuantityMode(false);
      } else {
        toast.error("Cannot exceed available stock.");
      }
    } else {
      toast.error("Please enter a valid quantity.");
    }
  };

  const handleUpdatePrix = (input) => {
    const newPrice = parseFloat(input);
    if (selectedItemId !== null && !isNaN(newPrice) && newPrice > 0) {
      const originalProduct = product.find(
        (item) => item.product_id === selectedItemId
      );
      if (newPrice >= originalProduct.selling_price) {
        dispatch({
          type: "UPDATE_PRICE",
          payload: { id: selectedItemId, selling_price: newPrice },
        });
        setInput("");
        setQuantityMode(false);
      } else {
        toast.error("New price must be at least original price.");
      }
    } else {
      toast.error("Please enter a valid price.");
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(false);
    localStorage.setItem("customer", customer.name);
    toast.success(`Customer selected: ${customer.name}`);
  };

  // Bulk return handler (uses note from modal)
  const handleBulkReturn = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    try {
      await Promise.all(
        cart.map(async (item) => {
          const returnData = {
            name_produit: item.product_name,
            name_user: localStorage.getItem("customer"), // Update with actual user info
            quantity: item.quantity,
            store_name: "Main Store", // Update with actual store info
            note: returnNote || "Bulk return from cart",
          };
          const response = await axios.post(
            "http://5.189.179.133:3000/api/returns", // Updated endpoint
            returnData
          );
          if (response.status !== 201) {
            throw new Error(
              "Failed to process return for " + item.product_name
            );
          }
        })
      );
      toast.success("Returns processed successfully!");
      dispatch({ type: "CLEAR_CART" });
      // Close modal and reset note
      setShowReturnModal(false);
      setReturnNote("");
    } catch (error) {
      toast.error(`Failed to process returns: ${error.message}`);
    }
  };

  return (
    <div
      className={`shadow-lg rounded-lg p-9 transition ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">Votre panier</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Votre panier est vide.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{item.product_name}</h3>
                  <p className="text-gray-500">
                    {item.selling_price} MAD x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setQuantityMode(true);
                      setInput("");
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center transition"
                  >
                    <FiEdit className="mr-1" /> Modifier
                  </button>
                  <button
                    onClick={() => {
                      dispatch({ type: "REMOVE_ITEM", payload: item.id });
                      if (selectedItemId === item.id) {
                        setSelectedItemId(null);
                        setInput("");
                      }
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center transition"
                  >
                    <FiTrash className="mr-1" /> Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between">
            <p className="font-bold text-lg">Total:</p>
            <p className="font-bold text-lg">{total} DH</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`mt-4 p-2 m-2 transition ${
              theme === "dark"
                ? "bg-gray-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {selectedCustomer
              ? `Selected: ${selectedCustomer.name}`
              : "Select Customer"}
          </button>
          {showModal && (
            <div
              className={`fixed inset-0 flex items-center justify-center transition-all ${
                theme === "dark"
                  ? "bg-black bg-opacity-70"
                  : "bg-black bg-opacity-50"
              }`}
            >
              <div
                className={`w-96 p-6 rounded-2xl shadow-xl transition-all ${
                  theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-black"
                }`}
              >
                <div className="flex justify-between items-center border-b pb-3">
                  <h2 className="text-xl font-semibold">Choisissez un client</h2>
                  <button
                    className="text-red-500 hover:text-red-700 transition"
                    onClick={() => setShowModal(false)}
                  >
                    <FiX size={20} />
                  </button>
                </div>
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Search customers..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                      theme === "dark"
                        ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-500"
                        : "focus:ring-blue-400"
                    }`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="mt-4 max-h-60 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredCustomers.map((customer) => (
                        <li
                          key={customer.id}
                          className={`p-3 cursor-pointer rounded-lg transition ${
                            selectedCustomer?.id === customer.id
                              ? "bg-blue-500 text-white font-bold"
                              : theme === "dark"
                              ? "hover:bg-gray-700"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handleCustomerSelect(customer)}
                        >
                          <span>{customer.name}</span>
                          <p className="text-sm text-gray-400">
                            {customer.email}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center mt-4">
                      Aucun client trouvé.
                    </p>
                  )}
                </div>
                <div className="mt-4 text-right">
                  <button
                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                    onClick={() => setShowModal(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
          {quantityMode && (
            <CalculatorCard
              input={input}
              setInput={setInput}
              handleUpdateQuantity={handleUpdateQuantity}
              handleUpdatePrix={handleUpdatePrix}
              theme={theme}
            />
          )}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => dispatch({ type: "CLEAR_CART" })}
              className="w-full px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
            >
              Vider le panier
            </button>
            <button
              onClick={() => handlePayment("Cash", selectedCustomer)}
              className="w-full px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
            >
              Cash
            </button>

            <button
              onClick={() =>
                selectedCustomer?.name === customers[0]?.name
                  ? null
                  : handlePayment("Credit", selectedCustomer)
              }
              className={`w-full px-4 py-2 ${
                selectedCustomer?.name === customers[0]?.name
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white font-semibold rounded transition`}
              disabled={selectedCustomer?.name === customers[0]?.name}
            >
              Credit
            </button>

            {/* Return Button only enables if not the first customer */}
            <button
              onClick={() =>
                selectedCustomer?.name === customers[0]?.name
                  ? null
                  : setShowReturnModal(true)
              }
              className={`w-full px-4 py-2 ${
                selectedCustomer?.name === customers[0]?.name
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white font-semibold rounded transition`}
              disabled={selectedCustomer?.name === customers[0]?.name}
            >
              Retour
            </button>
          </div>
          {/* Return Modal */}
          {showReturnModal && (
            <div className="fixed inset-0 flex items-center justify-center transition-all bg-black bg-opacity-50">
              <div className="w-96 p-6 rounded-2xl shadow-xl bg-white text-black">
                <h2 className="text-xl font-semibold mb-4">Return Items</h2>
                <textarea
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  placeholder="Enter return note..."
                  className="w-full p-2 border rounded mb-4"
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowReturnModal(false);
                      setReturnNote("");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleBulkReturn}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Soumettre le retour
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// -----------------
// Helper function: getSubCategories
const getSubCategories = (categories, mainCategory) => {
  if (mainCategory === "autre") {
    return categories.filter(
      (cat) =>
        !cat.name.toLowerCase().includes("afficheur") &&
        !cat.name.toLowerCase().includes("connecteur")
    );
  } else {
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(mainCategory)
    );
  }
};

// -----------------
// Custom Arrow Components for Slider
function CustomNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 p-2 bg-blue-500 text-white rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </div>
  );
}

function CustomPrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 p-2 bg-blue-500 text-white rounded-full"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );
}

// -----------------
// Updated CarouselSubCategoryFilter Component
const CarouselSubCategoryFilter = ({
  categories,
  mainCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  theme,
}) => {
  const subCategories = getSubCategories(categories, mainCategory);

  if (subCategories.length === 0) return null;

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  // Wrap slider with relative container and right padding to avoid overlap
  return (
    <div className="mb-2">
      <Slider {...settings}>
        <div className="relative left-10">
          <button
            onClick={() => setSelectedSubCategory(null)}
            className={`px-4 py-2 rounded ${
              selectedSubCategory === null
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All
          </button>
        </div>
        {subCategories.map((cat) => (
          <div
            key={cat.id}
            className={`border-r-8 bg-gray-100 h-16 ${
              theme === 'dark' ? "border-black" : "border-gray-100"
            }`}
            onClick={() => setSelectedSubCategory(cat.id)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={`/images/${cat.icon}.png`}
              alt={cat.slug}
              className={`w-full h-full object-cover transition-all ${
                selectedSubCategory === cat.id 
                  ? "bg-blue-500 border-2 border-blue-600" 
                  : "bg-gray-200"
              }`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

// -----------------
// MainCategoryFilter Component
const MainCategoryFilter = ({
  selectedMainCategory,
  setSelectedMainCategory,
  setSelectedSubCategory,
}) => {
  const mainCategories = ["afficheur", "connecteur", "autre"];
  return (
    <div className="flex space-x-2 mb-4">
      {mainCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setSelectedMainCategory(cat);
            setSelectedSubCategory(null); // reset sub-filter
          }}
          className={`px-4 py-2 rounded transition ${
            selectedMainCategory === cat
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
      ))}
    </div>
  );
};

// -----------------
// HomeDashboard Component
const HomeDashboard = () => {
  const navigate = useNavigate();
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("dark");
  const [selectedMainCategory, setSelectedMainCategory] = useState("afficheur");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const { id } = useParams();
  const StoreUser = localStorage.getItem("store");
  const StoreTrue = StoreUser === id;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  // Fetch categories
  const token = localStorage.getItem("token"); // ✅ جلب التوكن

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://5.189.179.133:3000/api/categorys/",{
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ إضافة التوكن فـ الهيدر
          },
        });

        if (!response.ok) throw new Error("Error fetching categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error(`Error fetching categories: ${error.message}`);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://5.189.179.133:3000/api/getStockQuantitiesByid/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // ✅ إضافة التوكن فـ الهيدر
            },
          });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        let filteredProducts = data;
        if (selectedSubCategory) {
          filteredProducts = data.filter(
            (product) => product.category_id === selectedSubCategory
          );
        } else {
          const groups = {
            afficheur: categories
              .filter((cat) => cat.name.toLowerCase().includes("afficheur"))
              .map((cat) => cat.id),
            connecteur: categories
              .filter((cat) => cat.name.toLowerCase().includes("connecteur"))
              .map((cat) => cat.id),
            autre: categories
              .filter(
                (cat) =>
                  !cat.name.toLowerCase().includes("afficheur") &&
                  !cat.name.toLowerCase().includes("connecteur")
              )
              .map((cat) => cat.id),
          };
          if (
            groups[selectedMainCategory] &&
            groups[selectedMainCategory].length > 0
          ) {
            filteredProducts = data.filter((product) =>
              groups[selectedMainCategory].includes(product.category_id)
            );
          }
        }
        filteredProducts = filteredProducts.filter((product) =>
          product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProducts(filteredProducts);
      } catch (error) {
        toast.error(`Error fetching products: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedMainCategory, selectedSubCategory, searchQuery, id, categories]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  // Payment function
  const handlePayment = async (paymentType, selectedCustomer) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    try {
      const total = cart.reduce(
        (sum, item) => sum + item.selling_price * item.quantity,
        0
      );
      // Retrieve the store id from local storage
      const storeId = localStorage.getItem("store");
      const tax = total * 0.0;
      const subTotal = total + tax;
      const orderData = {
        customer_id: selectedCustomer.id,
        order_date: new Date().toISOString(),
        total_products: cart.length,
        sub_total: total,
        vat: tax,
        total: subTotal,
        invoice_no: `INV-${Date.now()}`,
        payment_type: paymentType,
        pay: subTotal,
        due: 0,
        // Include store id in each product object as order_store
        products: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unitcost: item.selling_price,
          total: item.quantity * item.selling_price,
          order_store: storeId, // Using the store id from local storage
        })),
      };
      const response = await axios.post(
        "http://5.189.179.133:3000/api/orders",
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // ✅ إضافة التوكن فـ الهيدر
          },
        });
      if (response.data && response.data.orderId) {
        toast.success(
          `Order placed successfully! Order ID: INV-${Date.now()}`
        );
        dispatch({ type: "CLEAR_CART" });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Invalid response from server.");
      }
    } catch (error) {
      toast.error(`Failed to place the order: ${error.message}`);
    }
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } min-h-screen transition-all relative`}
    >
      {/* Header */}
      <div className="p-2 shadow-lg flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600">
        <div>
          <Link to="/isStore" className="text-xl font-bold tracking-wide">
            <img
              src={logo}
              alt="logo"
              className="w-38 h-14 object-contain"
            />
          </Link>
        </div>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 text-black border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        {/* Group the two buttons on the right */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-all"
          >
            {theme === "dark" ? (
              <FiSun size={24} className="text-yellow-500" />
            ) : (
              <FiMoon size={24} className="text-gray-800" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center bg-white text-red-600 px-4 py-2 rounded-lg shadow hover:bg-red-600 hover:text-white transition"
          >
            <span className="pr-2">Déconnecter</span>
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex ">
        {/* Left Section (Filters + Products) */}
        <div className="w-3/5 p-4 border-r-4" style={{ marginRight: "33%" }}>
          <MainCategoryFilter
            selectedMainCategory={selectedMainCategory}
            setSelectedMainCategory={setSelectedMainCategory}
            setSelectedSubCategory={setSelectedSubCategory}
          />
          <CarouselSubCategoryFilter
            categories={categories}
            mainCategory={selectedMainCategory}
            selectedSubCategory={selectedSubCategory}
            setSelectedSubCategory={setSelectedSubCategory}
            theme={theme}

          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {loading ? (
             
                  <div className="flex items-center justify-center h-screen">
                    <div className="flex gap-2">
                      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                      <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
                    </div>
                  </div>
                
              
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  dispatch={dispatch}
                  cart={cart}
                  theme={theme}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Section (Cart) */}
        <div className="w-2/5 fixed top-11 right-0 p-4 h-screen overflow-auto ">
          {StoreTrue && (
            <Cart
              cart={cart}
              product={products}
              dispatch={dispatch}
              handlePayment={handlePayment}
              theme={theme}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
