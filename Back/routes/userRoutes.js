import express from 'express';
import { 
    fetchAllUsers, 
    fetchUserById, 
    createNewUser, 
    updateExistingUser, 
    deleteExistingUser,
    loginUser
} from '../controllers/userController.js';
import { verifyToken } from '../config/jwtUtils.js'; 

const router = express.Router();

// Define user routes
router.get('/users', verifyToken, fetchAllUsers);
router.get('/users/:id', verifyToken, fetchUserById);
router.post('/users', verifyToken, createNewUser);
router.put('/users/:id', verifyToken, updateExistingUser);
router.delete('/users/:id', verifyToken, deleteExistingUser); // Fixed

// Login route (does not require token)
router.post('/login', loginUser);

export default router;
