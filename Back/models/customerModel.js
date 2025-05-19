// customerModel.js
import db from '../config/db.js';

// Get all customers
export const getAllCustomers = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                id,
                name,
                email,
                phone,
                address,
                photo,
                account_holder,
                account_number,
                bank_name,
                created_at,
                updated_at
            FROM customers;
        `;
        
        db.query(query, (err, results) => {
            if (err) return reject(err);
            resolve(results); // Return all customer data
        });
    });
};

// Get customer by ID
export const getCustomerById = (id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                id,
                name,
                email,
                phone,
                address,
                photo,
                account_holder,
                account_number,
                bank_name,
                created_at,
                updated_at
            FROM customers
            WHERE id = ?;
        `;
        
        db.query(query, [id], (err, results) => {
            if (err) return reject(err);
            
            if (results.length === 0) {
                return resolve(null); // Return null if no customer is found
            }
            
            resolve(results[0]); // Return the customer data
        });
    });
};

// Create a new customer
export const createCustomer = (customerData) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO customers (name, email, phone, address, photo, account_holder, account_number, bank_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        
        db.query(query, Object.values(customerData), (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId); // Return the new customer ID
        });
    });
};

// Update a customer
export const updateCustomer = (id, customerData) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE customers 
            SET name = ?, email = ?, phone = ?, address = ?, photo = ?, 
                account_holder = ?, account_number = ?, bank_name = ? 
            WHERE id = ?;
        `;
        
        db.query(query, [...Object.values(customerData), id], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows); // Return the number of affected rows
        });
    });
};

// Delete a customer
export const deleteCustomer = (id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM customers WHERE id = ?;`;
        
        db.query(query, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result.affectedRows); // Return the number of affected rows
        });
    });
};
