import express from 'express';

import {
    fetchAllOrders,
    fetchOrderById,
    createNewOrder,
    updateExistingOrder,
    deleteExistingOrder,
    
} from '../controllers/orderController.js';
import { verifyToken } from '../config/jwtUtils.js';

const router = express.Router();

// Get all orders
router.get('/', verifyToken, fetchAllOrders);

// Get order by ID
router.get('/:id', verifyToken, fetchOrderById);

// Create a new order
router.post('/', verifyToken, createNewOrder);

// Update an order
router.put('/:id', verifyToken, updateExistingOrder);

// Delete an order
router.delete('/:id', verifyToken, deleteExistingOrder)



export default router;
