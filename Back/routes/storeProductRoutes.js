import express from 'express';
import {addProductToStore,getStoreProducts,getALLStoreProducts} from '../controllers/storeProductController.js';
import { verifyToken } from '../config/jwtUtils.js';

const router = express.Router();

// إضافة منتج إلى متجر معين
router.post('/add', verifyToken, addProductToStore);

// جلب المنتجات في متجر معين
router.get('/', verifyToken, getALLStoreProducts);
router.get('/:storeId', verifyToken, getStoreProducts);

export default router;
