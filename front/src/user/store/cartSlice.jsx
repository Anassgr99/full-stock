import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

// Helper function to find an item in the cart by ID
const findItemIndex = (state, id) => state.findIndex(item => item.id === id);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add(state, action) {
      
      const existingItemIndex = findItemIndex(state, action.payload.id);
      if (existingItemIndex !== -1) {
        // If the item already exists, increase its quantity
        state[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // If the item does not exist, add it with the provided quantity
        state.push({
          ...action.payload,
          quantity: action.payload.quantity || 1, // Default quantity to 1 if not provided
        });
      }
    },

    remove(state, action) {
      return state.filter(item => item.id !== action.payload); // Remove item by ID
    },

    removeAll(state) {
      return []; // Clear the entire cart
    },

    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItemIndex = findItemIndex(state, id);
      if (existingItemIndex !== -1) {
        // Update quantity for the item
        state[existingItemIndex].quantity = quantity;
      }
    },
  },
});

export const { add, remove, removeAll, updateQuantity } = cartSlice.actions;

// Calculate total price
export const selectTotal = (state) =>
  state.cart.reduce((total, item) => total+ item.selling_price *item.quantity , 0);

export default cartSlice.reducer;
