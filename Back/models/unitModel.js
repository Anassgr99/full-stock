import db from '../config/db.js';

// Get all units
export const getAllUnit = async () => {
  const [units] = await db.query('SELECT * FROM units');
  return units;
};

// Get unit by ID
export const getUnitById = async (id) => {
  const [units] = await db.query('SELECT * FROM units WHERE id = ?', [id]);
  return units[0];
};

// Create a new unit
export const createUnit = async (unitData) => {
  const [result] = await db.query(`
    INSERT INTO units (name, slug, short_code, created_at, updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
  `, [unitData.name, unitData.slug, unitData.short_code]);

  return result;
};

// Update a unit
export const updateUnit = async (id, unitData) => {
  const [result] = await db.query(`
    UPDATE units
    SET name = ?, slug = ?, short_code = ?, updated_at = NOW()
    WHERE id = ?
  `, [unitData.name, unitData.slug, unitData.short_code, id]);

  return result;
};

// Delete a unit
export const deleteUnit = async (id) => {
  const [result] = await db.query('DELETE FROM units WHERE id = ?', [id]);
  return result;
};
