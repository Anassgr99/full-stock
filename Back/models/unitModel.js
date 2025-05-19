
import db from '../config/db.js';

// Get all units
export const getAllUnit = async () => {
  try {
    const sql = 'SELECT * FROM units';
    const units = await query(sql);
    return units;
  } catch (error) {
    throw new Error(`Error fetching all units: ${error.message}`);
  }
};

// Get unit by ID
export const getUnitById = async (id) => {
  try {
    const sql = 'SELECT * FROM units WHERE id = ?';
    const [unit] = await query(sql, [id]);
    return unit;
  } catch (error) {
    throw new Error(`Error fetching unit by ID: ${error.message}`);
  }
};

// Create a new unit
export const createUnit = async (unitData) => {
  try {
    const sql = `
      INSERT INTO units (name, slug, short_code, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())`;
    const [result] = await query(sql, [unitData.name, unitData.slug, unitData.short_code]);
    return result;
  } catch (error) {
    throw new Error(`Error creating unit: ${error.message}`);
  }
};

// Update a unit
export const updateUnit = async (id, unitData) => {
  try {
    const sql = `
      UPDATE units
      SET name = ?, slug = ?, short_code = ?, updated_at = NOW()
      WHERE id = ?`;
    const [result] = await query(sql, [unitData.name, unitData.slug, unitData.short_code, id]);
    return result;
  } catch (error) {
    throw new Error(`Error updating unit: ${error.message}`);
  }
};

// Delete a unit
export const deleteUnit = async (id) => {
  try {
    const sql = 'DELETE FROM units WHERE id = ?';
    const [result] = await query(sql, [id]);
    return result;
  } catch (error) {
    throw new Error(`Error deleting unit: ${error.message}`);
  }
};

// Helper function to handle database queries
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) {
        reject(new Error(`Database Error: ${err.message}`));
      } else {
        resolve(results);
      }
    });
  });
};
