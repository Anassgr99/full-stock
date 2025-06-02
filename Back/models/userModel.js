import db from "../config/db.js";
import bcrypt from "bcrypt";

// Get all users
export const getAllUsers = async () => {
  const [results] = await db.query("SELECT * FROM users");

  const parsedResults = results.map((user) => {
    const u = {
      ...user,
      role: {
        id: user.role_id,
        name: user.role_name,
      },
    };
    delete u.role_id;
    delete u.role_name;
    return u;
  });

  return parsedResults;
};

// Get user by ID
export const getUserById = async (id) => {
  const [results] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return results[0] || null;
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const query = `
      INSERT INTO users (name, username, email, password, remember_token, photo, isAdmin, store)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userData.name,
      userData.username,
      userData.email,
      hashedPassword,
      userData.remember_token,
      userData.photo,
      userData.isAdmin,
      userData.store,
    ];

    const [result] = await db.query(query, values);
    return result.insertId;
  } catch (error) {
    throw { message: "An error occurred while processing the request", error };
  }
};

// Update a user
export const updateUser = async (id, userData) => {
  const query = `
    UPDATE users 
    SET username = ?, email = ?, password = ?, role_id = ? 
    WHERE id = ?
  `;

  const values = [...Object.values(userData), id];
  const [result] = await db.query(query, values);
  return result.affectedRows;
};

// Delete a user
export const deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
  return result.affectedRows;
};

// Get user by email
export const getUserByEmail = async (email) => {
  const [results] = await db.query(
    `SELECT id, email, password, isAdmin, store, name FROM users WHERE email = ?`,
    [email]
  );

  return results.length ? results[0] : null;
};
