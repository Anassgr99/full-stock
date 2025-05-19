import express from 'express';
import { createRetournerEntries, getAllReturnEntries } from '../controllers/RetournerController.js';
import { verifyToken } from '../config/jwtUtils.js';

const router = express.Router();

router.post('/', verifyToken, createRetournerEntries);
router.get('/', verifyToken, getAllReturnEntries);

export default router;
