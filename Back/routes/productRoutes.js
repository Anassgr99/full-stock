import express from 'express';
import { fetchAllProducts, fetchProductById, createNewProduct,fetchStockQuantitiesByid, updateExistingProduct, deleteExistingProduct, getUnitController, getProductsByCategory, fetchStockQuantities } from '../controllers/productController.js';
import { verifyToken } from '../config/jwtUtils.js';


const router = express.Router();

// Define product routes
router.get('/products', verifyToken, fetchAllProducts);
router.get('/products/:id', verifyToken, fetchProductById);
router.post('/products', verifyToken, createNewProduct);
router.put('/products/:id', verifyToken, updateExistingProduct);
router.delete('/products/:id', verifyToken, deleteExistingProduct);
router.get('/units/:id', verifyToken, getUnitController);
router.get('/productsC/:categoryId', verifyToken, getProductsByCategory);
router.get('/getStockQuantities', verifyToken, fetchStockQuantities);
router.get('/getStockQuantitiesByid/:id', verifyToken, fetchStockQuantitiesByid);
export default router;
