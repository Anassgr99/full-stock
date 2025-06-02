import db from "../config/db.js";

// Get all return entries
export const getAllRetourner = async () => {
  const [results] = await db.query(`SELECT * FROM retourner`);
  return results;
};

// Create a new return entry
export const createRetourner = async (retournData) => {
  const query = `
    INSERT INTO retourner 
    (name_produit, name_user, quantity, return_date, store_name, note)
    VALUES (?, ?, ?, NOW(), ?, ?)
  `;

  const values = [
    retournData.name_produit,
    retournData.name_user,
    retournData.quantity,
    retournData.store_name,
    retournData.note,
  ];

  const [result] = await db.query(query, values);
  return result.insertId;
};
