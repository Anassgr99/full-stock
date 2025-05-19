// unitRoutes.js
import express from 'express';
import { 
  getAllUnits, 
  getUnit, 
  createNewUnit, 
  updateUnitInfo, 
  deleteUnitInfo 
} from '../controllers/unitController.js';
import { verifyToken } from '../config/jwtUtils.js';

const router = express.Router();

// Get all units
router.get('/unit', verifyToken, getAllUnits);

// Get a unit by ID
router.get('/unit/:id', verifyToken, getUnit);

// Create a new unit
router.post('/unit', verifyToken, createNewUnit);

// Update a unit by ID
router.put('/unit/:id', verifyToken, updateUnitInfo);

// Delete a unit by ID
router.delete('/unit/:id', verifyToken, deleteUnitInfo);

export default router;
