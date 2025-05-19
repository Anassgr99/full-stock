import db from "../config/db.js";

// Function to add a product to a store
export const addProductToStore = (storeId, productId, userQuantity) => {
  return new Promise((resolve, reject) => {
    // For storeId 1, update the record directly without adding
    if (storeId === 1) {
      const updateQuery = `
        UPDATE store_product 
        SET quantity = ?
        WHERE store_id = ? AND product_id = ?;
      `;
      db.query(updateQuery, [userQuantity, storeId, productId], (updateErr, updateResults) => {
        if (updateErr) return reject(updateErr);
        return resolve(updateResults);
      });
    } else {
      // For other stores, first fetch store 1's quantity for validation if needed
      const fetchQuery = `
        SELECT quantity FROM store_product 
        WHERE store_id = 1 AND product_id = ?;
      `;
      db.query(fetchQuery, [productId], (fetchErr, fetchResults) => {
        if (fetchErr) return reject(fetchErr);
  
        const store1Quantity = fetchResults[0]?.quantity || 0; // Quantity in store 1
  
        // Only update/insert for other stores if userQuantity is less than store1Quantity
        if (userQuantity <= store1Quantity) {
          const checkPairQuery = `
            SELECT * FROM store_product 
            WHERE store_id = ? AND product_id = ?;
          `;
          db.query(checkPairQuery, [storeId, productId], (checkErr, checkResults) => {
            if (checkErr) return reject(checkErr);
  
            if (checkResults.length > 0) {
              // If record exists, update it
              const updateQuery = `
                UPDATE store_product
                SET quantity = CASE
                  WHEN store_id = 1 THEN quantity - ?
                  WHEN store_id = ? THEN quantity + ?
                END
                WHERE product_id = ? AND (store_id = 1 OR store_id = ?);
              `;
              db.query(
                updateQuery,
                [userQuantity, storeId, userQuantity, productId, storeId],
                (updateErr, updateResults) => {
                  if (updateErr) return reject(updateErr);
                  return resolve(updateResults);
                }
              );
            } else {
              // Otherwise, insert a new record
              const insertQuery = `
                INSERT INTO store_product (store_id, product_id, quantity)
                VALUES (?, ?, ?);
              `;
              db.query(
                insertQuery,
                [storeId, productId, userQuantity],
                (insertErr, insertResults) => {
                  if (insertErr) return reject(insertErr);
                  return resolve(insertResults);
                }
              );
            }
          });
        } else {
          reject({
            response: {
              status: 400,
              data: {
                message: "Quantity from user must be less than quantity in store_id = 1.",
              },
            },
          });
        }
      });
    }
  });
};


export const getStoreProducts = (storeId) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT p.name AS product_name, sp.quantity
        FROM store_product sp
        JOIN products p ON sp.product_id = p.id
        WHERE sp.product_id = ?;
      `;
    db.query(query, [storeId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
export const getAllStoreProductsModel = (storeId) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT 
        sp.id,
        sp.store_id,
        sp.product_id,
        sp.quantity,
        p.quantity_alert,
        sp.created_at,
        sp.updated_at,
        p.name AS product_name,
        s.store_name
      FROM store_product sp
      JOIN products p ON sp.product_id = p.id
      JOIN stores s ON sp.store_id = s.id;
      `;
    db.query(query, [storeId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
