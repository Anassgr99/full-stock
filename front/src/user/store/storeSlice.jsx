import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedStore: null,
};

const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
  },
});

export const { setSelectedStore } = storeSlice.actions;

export default storeSlice.reducer;
