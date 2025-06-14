import React from "react";
import axios from "axios";
import Avatar from "react-avatar";
import ScrollableFeed from "react-scrollable-feed";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import {
  add,
  remove,
  removeAll,
  selectTotal,
  updateQuantity,
} from "./store/cartSlice";

const CartItems = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart); // Access the cart state
  const total = useSelector(selectTotal); // Get the total price using the selector
  const tax = (5.25 / 100) * total;
  const subTotal = total + tax;
  const storedStoreId = 1;
  const getstore = localStorage.getItem("store");
  const customer = localStorage.getItem("customerId");
  const user_name = localStorage.getItem("customerName") || "Unknown User";

  
  
  const handleCashPayment = async () => {

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
    } else {
      try {
        const orderData = {
          customer_id: customer,
          order_date: new Date().toISOString(),
          total_products: cartItems.length,
          sub_total: total,
          vat: tax,
          total: subTotal,
          invoice_no: `INV-${Date.now()}`,
          payment_type: "Cash",
          pay: subTotal,
          due: 0,
          order_store: storedStoreId,
          products: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            unitcost: item.price,
            order_store: getstore,
            total: item.quantity * item.price,
          })),
        };
  
        const response = await axios.post(
          "https://api.simotakhfid.ma/api/orders",
          orderData
        );
       
        
  
        toast.success(`Order placed successfully! Order ID: ${response.data.orderId}`, {
          position: "top-center",
          autoClose: 5000, // Toast kayban 5 sec
        });
        
        dispatch(removeAll()); // Clear cart
  
       
      } catch (error) {
        toast.error(`Failed to place the order: ${error.message}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
  };
  

  const handleCreditPayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
    } else {
      try {
        const orderData = {
          customer_id: customer,
          order_date: new Date().toISOString(),

          total_products: cartItems.length,
          sub_total: total,
          vat: tax,
          total: subTotal,
          invoice_no: `INV-${Date.now()}`,
          payment_type: "Credit",
          pay: subTotal,
          due: 0,
          order_store: storedStoreId,
          products: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            unitcost: item.price,
            order_store: getstore,
            total: item.quantity * item.price,
          })),
        };
        const response = await axios.post(
          "https://api.simotakhfid.ma/api/orders",
          orderData
        );
        toast.success(
          `Order placed successfully! Order ID: ${response.data.orderId}`,
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        dispatch(removeAll()); // Clear the cart after order is placed
      } catch (error) {
        toast.error(`Failed to place the order: ${error.message}`, {
          position: "top-center",
          autoClose: 5000,
        });
      }
    }
  };

  const handleRemove = (id) => {
    dispatch(remove(id)); // Remove an item from the cart
  };

  const handleReturn = async (item) => {
    const note = prompt("Please enter a note for the return (optional):", ""); // Prompt for a note
    if (note === null) return; // User canceled the action

    // //////console.log(item);

    // Dynamically populate returnData using the properties of the 'item'
    const returnData = {
      name_produit: item.name,
      name_user: user_name, 
      quantity: item.quantity,
      store_name: getstore,
      note: note || null, // Use the entered note or null if canceled
    };

    // //////console.log(returnData); // Debugging log to see the final returnData

    try {
      // Send the returnData to your backend API
      await axios.post("https://api.simotakhfid.ma/api/returns", returnData);
      toast.success("Return processed successfully!", {
        position: "top-center",
        autoClose: 5000,
      });
      window.location.reload(); // Refresh the page
    } catch (error) {
      toast.error(
        `Failed to process return: ${
          error.response ? error.response.data : error.message
        }`,
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    }
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity })); // Update the quantity of an item
    }
  };
  // {cartItems.map((curr, index) => 
  // //////console.log(curr.selling_price * curr.quantity)
  
  // )}
  return (
    <div>
      <ToastContainer />
      <ScrollableFeed>
        <div className="flex flex-col justify-between text-white">
          <div className="flex flex-col px-4 py-4 space-y-1  overflow-y-scroll">
            {cartItems.length > 0 ? (
              <div>
                <ul role="list" className="divide-y divide-black">
                  {cartItems.map((curr, index) => (
                    <li key={index} className="px-4 py-2">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-xs font-medium text-white">
                          {index + 1}. {curr.name}
                         
                        </p>
                        <p className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 text-white">
                          {curr.selling_price * curr.quantity} DH
                        </p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(curr.id, curr.quantity - 1)
                            }
                            className="px-2 py-0 text-white bg-blue-500 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-200"
                          >
                            -
                          </button>
                          <span className="text-white">{curr.quantity}</span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(curr.id, curr.quantity + 1)
                            }
                            className="px-2  text-white bg-blue-500 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-200"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemove(curr.id)}
                            className="px-2 py-1 text-white bg-green-500 rounded-full hover:bg-green-700 hover:scale-110 transition-all duration-200"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReturn(curr)}
                            className="px-2 py-1 text-white bg-red-500 rounded-full hover:bg-red-700 hover:scale-110 transition-all duration-200"
                          >
                            Retour
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-24">
                <small className="text-[#474c54]">Aucun article dans le panier</small>
              </div>
            )}
          </div>
          <div className="pl-2 bg-slate-500 py-3  flex justify-between">
            <p>Total : </p>
            <p>{total} DH </p>
          </div>
          <div className="grid gap-0 pt-2 text-center   w-full">
            <div
              className={cartItems.length > 0 ? "bg-[#3441d4]" : "bg-gray-500"}
            >
              <button
                onClick={handleCashPayment}
                className={
                  cartItems.length > 0
                    ? "py-4 hover:bg-[#3a56e1] transition-all duration-200"
                    : "py-4 cursor-not-allowed"
                }
              >
                Cash
              </button>
            </div>
            <div
              className={cartItems.length > 0 ? "bg-red-700 " : "bg-gray-500"}
            >
              <button
                onClick={handleCreditPayment}
                className={
                  cartItems.length > 0
                    ? "py-4 hover:bg-[#3a56e1] transition-all duration-200"
                    : "py-4 cursor-not-allowed"
                }
              >
                Credit
              </button>
            </div>
          </div>
        </div>
      </ScrollableFeed>
    </div>
  );
};

export default CartItems;
