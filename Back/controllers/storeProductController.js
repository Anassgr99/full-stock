import { 
  addProductToStore as addProductToStoreModel, 
  getStoreProducts as getStoreProductsModel, 
  getAllStoreProductsModel 
} from '../models/storeProductModel.js'; // Import model functions with alias

import db from '../config/db.js'; // ✅ Import de la connexion à la base de données
import apm from 'elastic-apm-node';

// ✅ Fonction pour réduire la quantité d’un produit dans un magasin
export const reduceProductQuantity = async (req, res) => {
  const { store_id, product_id, quantity } = req.body;

  if (!store_id || !product_id || typeof quantity !== "number") {
    return res.status(400).json({
      message: "Invalid input. Please provide valid store_id, product_id, and quantity.",
    });
  }

  try {
    const query = `
      UPDATE store_product
      SET quantity = quantity - ?
      WHERE store_id = ? AND product_id = ? AND quantity >= ?;
    `;

    const [result] = await db.query(query, [quantity, store_id, product_id, quantity]);

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Not enough quantity or invalid store/product pair.",
      });
    }

    return res.status(200).json({
      message: "Quantity reduced successfully.",
    });
  } catch (error) {
    apm.captureError(error);
    console.error("Reduce product quantity error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ✅ Fonction pour ajouter un produit à un magasin
export const addProductToStore = async (req, res) => {
  const { store_id, product_id, quantity } = req.body;

  if (!store_id || !product_id || typeof quantity !== "number") {
    apm.captureError(new Error('Invalid input. Please provide valid store_id, product_id, and quantity.'));
    return res.status(400).json({
      message: "Invalid input. Please provide valid store_id, product_id, and quantity.",
    });
  }

  try {
    await addProductToStoreModel(store_id, product_id, quantity);
    return res.status(201).json({ message: "Product added to store successfully" });
  } catch (error) {
    apm.captureError(error);
    console.error("Add product to store error:", error);
    return res.status(400).json({
      message: "Server error",
      error: error.message || "Stock insuffisant",
    });
  }
};

// ✅ Fonction pour récupérer tous les produits d’un magasin
export const getStoreProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    const products = await getStoreProductsModel(storeId);
    return res.status(200).json(products);
  } catch (error) {
    apm.captureError(error);
    console.error("Get store products error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

// ✅ Fonction pour récupérer tous les produits de tous les magasins
export const getALLStoreProducts = async (req, res) => {
  const { storeId } = req.params;

  try {
    const products = await getAllStoreProductsModel(storeId);
    return res.status(200).json(products);
  } catch (error) {
    apm.captureError(error);
    console.error("Get ALL store products error:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};
