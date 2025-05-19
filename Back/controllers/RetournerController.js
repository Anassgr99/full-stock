import { getAllRetourner, createRetourner } from '../models/retournerModel.js';
import apm from 'elastic-apm-node';
// Get all return entries
export const getAllReturnEntries = async (req, res) => {
  try {
    const returnData = await getAllRetourner();
    res.status(200).json({ data: returnData });
  } catch (error) {
    apm.captureError(error);
    console.error("Failed to fetch returns:", error); // Log the error for debugging purposes
    return res.status(500).json({ error: 'Failed to fetch returns', message: error.message });
  }
};

// Create a new return entry
export const createRetournerEntries = async (req, res) => {
  try {
    const returnData = req.body; // Extract data from request body
    if (!returnData || !returnData.name_produit || !returnData.name_user) {
      apm.captureError(new Error('Missing required fields'));
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await createRetourner(returnData); // Pass the data to the model function
    res.status(201).json({ data: result });
  } catch (error) {
    apm.captureError(error);
    console.error("Failed to create return entry:", error); // Log the error for debugging purposes
    return res.status(500).json({ error: 'Failed to create return entry', message: error.message });
  }
};
