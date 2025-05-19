import express from 'express';
import { createNewStore, fetchAllStores, fetchStoreById, updateExistingStore, deleteExistingStore } from '../controllers/storeController.js';
import { verifyToken } from '../config/jwtUtils.js';

const router = express.Router();

// Add a new store
router.post('/', verifyToken, createNewStore);

// Get all stores
router.get('/', verifyToken, fetchAllStores);

// Get a store by ID
router.get('/:id', verifyToken, fetchStoreById);

// Update a store by ID
router.put('/:id', verifyToken, updateExistingStore);

// Delete a store by ID
router.delete('/:id', verifyToken, deleteExistingStore);

export default router;
