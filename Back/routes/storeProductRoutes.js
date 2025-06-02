import express from 'express';
import {addProductToStore,getStoreProducts,getALLStoreProducts} from '../controllers/storeProductController.js';
import { reduceProductQuantity } from '../controllers/storeProductController.js';
import { verifyToken } from '../config/jwtUtils.js';

const router = express.Router();

// إضافة منتج إلى متجر معين
router.post('/add', verifyToken, addProductToStore);
router.post("/reduce", verifyToken, reduceProductQuantity); // <-- Cette ligne doit exister


// جلب المنتجات في متجر معين
router.get('/', verifyToken, getALLStoreProducts);
router.get('/:storeId', verifyToken, getStoreProducts);

export default router;
