import db from '../config/db.js';

// Get all stores
export const getAllStores = async () => {
  const [results] = await db.query(`
    SELECT 
      id,
      store_name,
      store_address,
      store_phone,
      created_at,
      updated_at
    FROM stores
  `);
  return results;
};

// Get store by ID
export const getStoreById = async (id) => {
  const [results] = await db.query(`
    SELECT 
      id,
      store_name,
      store_address,
      store_phone,
      created_at,
      updated_at
    FROM stores
    WHERE id = ?
  `, [id]);

  return results.length ? results[0] : null;
};

// Create a new store
export const createStore = async (storeData) => {
  const [result] = await db.query(`
    INSERT INTO stores (store_name, store_address, store_phone)
    VALUES (?, ?, ?)
  `, Object.values(storeData));

  return result.insertId;
};

// Update a store
export const updateStore = async (id, storeData) => {
  const [result] = await db.query(`
    UPDATE stores
    SET store_name = ?, store_address = ?, store_phone = ?
    WHERE id = ?
  `, [...Object.values(storeData), id]);

  return result.affectedRows;
};

// Delete a store
export const deleteStore = async (id) => {
  const [result] = await db.query(`DELETE FROM stores WHERE id = ?`, [id]);
  return result.affectedRows;
};
