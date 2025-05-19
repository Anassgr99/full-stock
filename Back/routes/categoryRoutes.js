// categoryRoutes.js
import express from 'express';
import * as categoryController from '../controllers/CategoryController.js';
import { verifyToken } from '../config/jwtUtils.js';

const router = express.Router();

// Routes for categories
router.get('/', verifyToken, categoryController.getCategories); // Get all categories
router.get('/:id', verifyToken, categoryController.getCategory); // Get category by ID
router.post('/', verifyToken, categoryController.createCategory); // Create new category
router.put('/:id', verifyToken, categoryController.updateCategory); // Update category
router.delete('/:id', verifyToken, categoryController.deleteCategory); // Delete category

export default router;
