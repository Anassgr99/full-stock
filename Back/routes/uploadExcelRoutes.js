import express from "express";
import multer from "multer";
import { uploadExcel,uploadExcelFirstTime } from "../controllers/uploadExcelController.js";
import { verifyToken } from "../config/jwtUtils.js";

const router = express.Router();

// Configure multer to store the uploaded file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the route for Excel file uploads
router.post("/uploadExcel",verifyToken, upload.single("file"), uploadExcel);
router.post("/uploadExcelFirstTime",verifyToken, upload.single("file"), uploadExcelFirstTime);

export default router;
