import db from "../config/db.js";

// Get all return entries
export const getAllRetourner = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM retourner`;
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Create a new return entry
export const createRetourner = (retournData) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO retourner (name_produit, name_user, quantity, return_date, store_name, note)
      VALUES (?, ?, ?, NOW(), ?, ?)
    `;
    db.query(query, [
      retournData.name_produit,
      retournData.name_user,
      retournData.quantity,
      retournData.store_name,
      retournData.note
    ], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};
