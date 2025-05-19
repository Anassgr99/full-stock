import express from "express";
import { downloadProductsExcel,downloadRetournerExcel,downloadOrdersExcel,downloadStoreProductsExcel } from "../controllers/downloadExcelController.js";
import { verifyToken } from "../config/jwtUtils.js";

const router = express.Router();

// Define the route for Excel file downloads
router.get("/downloadProductsExcel", verifyToken, downloadProductsExcel);
router.get("/downloadRetournerExcel", verifyToken, downloadRetournerExcel);
router.get("/downloadOrdersExcel",   verifyToken, downloadOrdersExcel);
router.get("/downloadStoreProductsExcel", verifyToken, downloadStoreProductsExcel);
export default router;