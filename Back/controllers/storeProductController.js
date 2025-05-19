import { addProductToStore as addProductToStoreModel, getStoreProducts as getStoreProductsModel,getAllStoreProductsModel } from '../models/storeProductModel.js'; // Import model functions with alias
import apm from 'elastic-apm-node';
// Function to add product to store
export const addProductToStore = async (req, res) => {
  const { store_id, product_id, quantity } = req.body;
  
  // Input validation
  if (!store_id || !product_id || typeof quantity !== "number") {
    apm.captureError(new Error('Invalid input. Please provide valid store_id, product_id, and quantity.'))
    return res.status(400).json({
      message: "Invalid input. Please provide valid store_id, product_id, and quantity.",
    });
  }
  try {
    // Call the model function
    await addProductToStoreModel(store_id, product_id, quantity);

    return res.status(201).json({ message: "Product added to store successfully" });
  } catch (error) {
    apm.captureError(error);
    console.error("add product to store Error:", error); // Log the error for debugging purposes
    return res.status(400).json({
      message: "Server error",
      error: error.message || "Stock insuffisant",
    });
  }
};


// Function to get all products in a store
export const getStoreProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    // Call the model function
    const products = await getStoreProductsModel(storeId);
    return res.status(200).json(products);
  } catch (error) {
    //console.error(error);
    apm.captureError(error);
    console.error("get Store Product Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Server error', error });
  }
};
export const getALLStoreProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    // Call the model function
    const products = await getAllStoreProductsModel(storeId);
    return res.status(200).json(products);
  } catch (error) {
    //console.error(error);
    apm.captureError(error);
    console.error("get ALL Store Product Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ message: 'Server error', error });
  }
};
