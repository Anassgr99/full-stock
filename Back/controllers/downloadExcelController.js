import ExcelJS from "exceljs";
import { getAllProductsForExcel,getAllRetourner,getAllOrdersForExcel,getAllStoreProductsForExcel } from "../models/downloadExcelModel.js";
import apm from 'elastic-apm-node';

/**
 * Controller to handle Excel file download.
 * Fetches product data, creates an Excel file, and sends it as a download.
 */
export const downloadProductsExcel = async (req, res) => {
  try {
    // Get data from the database
    const products = await getAllProductsForExcel();
    
    // Create a workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');
    
    // Add column headers
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Slug', key: 'slug', width: 30 },
      { header: 'Code', key: 'code', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Buying Price', key: 'buying_price', width: 15 },
      { header: 'Selling Price', key: 'selling_price', width: 15 },
      { header: 'Quantity Alert', key: 'quantity_alert', width: 15 },
      { header: 'Notes', key: 'notes', width: 30 },
      { header: 'Category Name', key: 'category_name', width: 20 },
      { header: 'Category Slug', key: 'category_slug', width: 20 }
    ];
    
    // Add data rows
    products.forEach(product => {
      worksheet.addRow(product);
    });
    
    // Apply styles to header row
    worksheet.getRow(1).font = { bold: true };
    
    // Set response headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');
    
    // Write workbook to response
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    apm.captureError(error);
    console.error("Error generating Excel file:", error);
    res.status(500).json({ error: "Error generating Excel file." });
  }
};

export const downloadRetournerExcel = async (req, res) => {
  try {
    // Fetch data from retourner table
    const returns = await getAllRetourner();

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Retourner');

    // Define columns for the retourner export
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Nom de produit', key: 'name_produit', width: 30 },
      { header: "Nom d'employer", key: 'name_user', width: 25 },
      { header: 'Quantité', key: 'quantity', width: 10 },
      { header: 'Date de retour', key: 'return_date', width: 20 },
      { header: 'Nom de Magasine', key: 'store_name', width: 25 },
      { header: 'Note', key: 'note', width: 40 }
    ];

    // Add rows for each return entry
    returns.forEach(retour => {
      worksheet.addRow(retour);
    });

    // Optionally, format the header row to be bold
    worksheet.getRow(1).font = { bold: true };

    // Set response headers to force the file download
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=retourner.xlsx');

    // Write workbook to the response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    // Capture error with APM and respond with error status
    apm.captureError(error);
    console.error("Error generating Retourner Excel file:", error);
    res.status(500).json({ error: "Error generating Excel file." });
  }
};

export const downloadOrdersExcel = async (req, res) => {
  try {
    const orders = await getAllOrdersForExcel();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Orders");

    worksheet.columns = [
      { header: "ID de commande",     key: "order_id",       width: 15 },
      { header: "N° de facture",       key: "invoice_no",     width: 20 },
      { header: "Date de commande",    key: "order_date",     width: 20 },
      { header: "Type de paiement",    key: "payment_type",   width: 20 },
      { header: "Total (DH)",          key: "total",          width: 15 },
      { header: "Nom du client",       key: "customer_name",  width: 25 },
      { header: "Nom du magasin",      key: "store_name",     width: 25 },
      { header: "Produits",            key: "product_names",  width: 50 }
    ];

    orders.forEach(order => worksheet.addRow(order));
    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    apm.captureError(error);
    console.error("Error generating Orders Excel file:", error);
    res.status(500).json({ error: "Error generating Excel file." });
  }
};

export const downloadStoreProductsExcel = async (req, res) => {
  try {
    const rows = await getAllStoreProductsForExcel();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Store Products");

    // Colonnes en français
    worksheet.columns = [
      { header: "Nom de Produit",   key: "product_name",   width: 30 },
      { header: "Store 1 Quantité", key: "store1_quantity",width: 20 },
      { header: "Store 2 Quantité", key: "store2_quantity",width: 20 },
      { header: "Store 3 Quantité", key: "store3_quantity",width: 20 },
    ];

    // Remplissage des lignes
    rows.forEach((r) => worksheet.addRow(r));

    // Style de l'en‑tête
    worksheet.getRow(1).font = { bold: true };

    // En‑têtes HTTP pour forcer le téléchargement
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=store_products.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    apm.captureError(error);
    console.error("Error generating Store Products Excel file:", error);
    res.status(500).json({ error: "Error generating Excel file." });
  }
};