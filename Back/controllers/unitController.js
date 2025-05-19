// unitController.js
import { getAllUnit, getUnitById, createUnit, updateUnit, deleteUnit } from '../models/unitModel.js';
import apm from 'elastic-apm-node';

// Get all units
export const getAllUnits = async (req, res) => {
  try {
    const units = await getAllUnit();
    res.status(200).json(units);
  } catch (error) {
    apm.captureError(error);
    console.error("Get all units Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ message: `Error fetching units: ${error.message}` });
  }
};

// Get unit by ID
export const getUnit = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await getUnitById(id);
    if (!unit) {
      apm.captureError(new Error('Unit not found.'));
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.status(200).json(unit);
  } catch (error) {
    apm.captureError(error);
    console.error("Get unit by ID Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ message: `Error fetching unit: ${error.message}` });
  }
};

// Create a new unit
export const createNewUnit = async (req, res) => {
  const { name, slug, short_code } = req.body;

  if (!name || !slug || !short_code) {
    apm.captureError(new Error('Missing required fields: name, slug, and short_code'));
    return res.status(400).json({ message: 'Missing required fields: name, slug, and short_code' });
  }

  const unitData = { name, slug, short_code };

  try {
    const result = await createUnit(unitData);
    res.status(201).json({ message: 'Unit created successfully', result });
  } catch (error) {
    apm.captureError(error);
    console.error("creating unit Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ message: `Error creating unit: ${error.message}` });
  }
};

// Update a unit
export const updateUnitInfo = async (req, res) => {
  const { id } = req.params;
  const { name, slug, short_code } = req.body;

  if (!name || !slug || !short_code) {
    apm.captureError(new Error('Missing required fields: name, slug, and short_code'));
    return res.status(400).json({ message: 'Missing required fields: name, slug, and short_code' });
  }

  const unitData = { name, slug, short_code };

  try {
    const result = await updateUnit(id, unitData);
    if (result.affectedRows === 0) {
      apm.captureError(new Error('Unit not found.'));
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.status(200).json({ message: 'Unit updated successfully' });
  } catch (error) {
    apm.captureError(error);
    console.error("updating unit Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ message: `Error updating unit: ${error.message}` });
  }
};

// Delete a unit
export const deleteUnitInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteUnit(id);
    if (result.affectedRows === 0) {
      apm.captureError(new Error('Unit not found.'));
      return res.status(404).json({ message: 'Unit not found' });
    }
    res.status(200).json({ message: 'Unit deleted successfully' });
  } catch (error) {
    apm.captureError(error);
    console.error("deleting unit Error:", error); // Log the error for debugging purposes
    return res.status(500).json({ message: `Error deleting unit: ${error.message}` });
  }
};
