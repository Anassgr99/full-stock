import db from '../config/db.js';

// Get all customers
export const getAllCustomers = async () => {
  const [results] = await db.query(`
    SELECT 
      id, name, email, phone, address, photo,
      account_holder, account_number, bank_name,
      created_at, updated_at
    FROM customers
  `);
  return results;
};

// Get customer by ID
export const getCustomerById = async (id) => {
  const [results] = await db.query(`
    SELECT 
      id, name, email, phone, address, photo,
      account_holder, account_number, bank_name,
      created_at, updated_at
    FROM customers
    WHERE id = ?
  `, [id]);

  return results.length ? results[0] : null;
};

// Create a new customer
export const createCustomer = async (customerData) => {
  const [result] = await db.query(`
    INSERT INTO customers 
    (name, email, phone, address, photo, account_holder, account_number, bank_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, Object.values(customerData));

  return result.insertId;
};

// Update a customer
export const updateCustomer = async (id, customerData) => {
  const [result] = await db.query(`
    UPDATE customers 
    SET name = ?, email = ?, phone = ?, address = ?, photo = ?, 
        account_holder = ?, account_number = ?, bank_name = ?
    WHERE id = ?
  `, [...Object.values(customerData), id]);

  return result.affectedRows;
};

// Delete a customer
export const deleteCustomer = async (id) => {
  const [result] = await db.query(`DELETE FROM customers WHERE id = ?`, [id]);
  return result.affectedRows;
};
