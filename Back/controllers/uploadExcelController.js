import ExcelJS from "exceljs";
import { createProductWithStores ,createOrUpdateProductWithStores } from "../models/uploadExcelModel.js";
import apm from 'elastic-apm-node';

/**
 * Controller to handle Excel file upload.
 * Reads the uploaded file using ExcelJS, converts it to JSON,
 * and inserts each row into the products table.
 */
export const uploadExcel = async (req, res) => {
  if (!req.file) {
    apm.captureError(new Error('No file uploaded'));
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Read the Excel file from buffer
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0]; // Get the first sheet
    const jsonData = [];

    // Extract data row by row
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      jsonData.push({
        name: row.getCell(1).value,
        slug: row.getCell(2).value,
        code: row.getCell(3).value,
        quantity: row.getCell(4).value,
        buying_price: row.getCell(5).value,
        selling_price: row.getCell(6).value,
        quantity_alert: row.getCell(7).value,
        notes: row.getCell(8).value,
        category_name: row.getCell(9).value,
        category_slug: row.getCell(10).value,

      });
    });

    if (!jsonData.length) {
      apm.captureError(new Error('Excel file is empty or improperly formatted.'));
      return res.status(400).json({ error: "Excel file is empty or improperly formatted." });
    }

    // Insert data into the database
    await Promise.all(jsonData.map((row) => createProductWithStores(row)));

    res.json({ message: "Excel file processed and data inserted successfully." });
  } catch (error) {
    //console.error("Error processing Excel file:", error);
    apm.captureError(error);
    console.error("Error processing Excel file:", error); // Log the error for debugging purposes
    return res.status(500).json({ error: "Error processing Excel file." });
  }
};

export const uploadExcelFirstTime = async (req, res) => {
    if (!req.file) {
      apm.captureError(new Error("No file uploaded"));
      return res.status(400).json({ error: "No file uploaded" });
    }
  
    // Get storeId from the request body (default to "1" if not provided)
    const storeId = req.body.storeId || "1";
  
    try {
      // Read the Excel file from buffer
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(req.file.buffer);
  
      const worksheet = workbook.worksheets[0]; // Get the first sheet
      const jsonData = [];
  
      // Extract data row by row (skipping header)
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row
  
        jsonData.push({
          name: row.getCell(1).value,
          slug: row.getCell(2).value,
          code: row.getCell(3).value,
          quantity: row.getCell(4).value,
          buying_price: row.getCell(5).value,
          selling_price: row.getCell(6).value,
          quantity_alert: row.getCell(7).value,
          notes: row.getCell(8).value,
          category_name: row.getCell(9).value,
          category_slug: row.getCell(10).value,
        });
      });
  
      if (!jsonData.length) {
        apm.captureError(new Error("Excel file is empty or improperly formatted."));
        return res
          .status(400)
          .json({ error: "Excel file is empty or improperly formatted." });
      }
  
      // Upsert each product for the given store
      await Promise.all(
        jsonData.map((row) => createOrUpdateProductWithStores(row, storeId))
      );
  
      res.json({ message: "Excel file processed and data inserted/updated successfully." });
    } catch (error) {
      apm.captureError(error);
      console.error("Error processing Excel file:", error);
      return res.status(500).json({ error: "Error processing Excel file." });
    }
  };