// storeModel.js
import db from '../config/db.js';

// Get all stores
export const getAllStores = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                id,
                store_name,
                store_address,
                store_phone,
                created_at,
                updated_at
            FROM stores;
        `;
        
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results); // Return all store data
        });
    });
};

// Get store by ID
export const getStoreById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                id,
                store_name,
                store_address,
                store_phone,
                created_at,
                updated_at
            FROM stores
            WHERE id = ?;
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            
            if (results.length === 0) {
                return resolve(null); // Return null if no store is found
            }
            
            resolve(results[0]); // Return the store data
        });
    });
};

// Create a new store
export const createStore = (storeData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO stores (store_name, store_address, store_phone)
            VALUES (?, ?, ?);
        `;
        
        db.query(query, Object.values(storeData), (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId); // Return the new store ID
        });
    });
};

// Update a store
export const updateStore = (id, storeData) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE stores
            SET store_name = ?, store_address = ?, store_phone = ?
            WHERE id = ?;
        `;
        
        db.query(query, [...Object.values(storeData), id], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows); // Return the number of affected rows
        });
    });
};

// Delete a store
export const deleteStore = (id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM stores WHERE id = ?;`;
        
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows); // Return the number of affected rows
        });
    });
};
