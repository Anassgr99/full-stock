import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import customerReducer from "./customerSlice";
import placedOrderSlice from "./placedOrderSlice";
import allCustomerReducer from "./allCustomerSlice";
import storeReducer from "./storeSlice";  // Import the store slice

const store = configureStore({
  reducer: {
    cart: cartReducer,
    customer: customerReducer,
    ordered: placedOrderSlice,
    allcustomer: allCustomerReducer,
    store: storeReducer, // Add it to the store
  },
});

export default store;
