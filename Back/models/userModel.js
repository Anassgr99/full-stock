import db from "../config/db.js";
import bcrypt from "bcrypt";

// Get all users
export const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users";

    db.query(query, (err, results) => {
      if (err) return reject(err);

      // Map the results and structure role as an object
      const parsedResults = results.map((user) => ({
        ...user,
        role: {
          id: user.role_id,
          name: user.role_name,
        },
      }));

      // Clean up the additional fields used for mapping
      parsedResults.forEach((user) => {
        delete user.role_id;
        delete user.role_name;
      });

      resolve(parsedResults);
    });
  });
};

// Get user by ID
export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
           SELECT * FROM users WHERE id = ?;
        `;
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // Resolve with the first user result
    });
  });
};

// Create a new user
export const createUser = async (userData) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const query = `
        INSERT INTO users (name, username, email, password, remember_token, photo, isAdmin, store)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
      `;

      // Replace plain password with hashed password
      const values = [
        userData.name,
        userData.username,
        userData.email,
        hashedPassword, // Hashed password
        userData.remember_token,
        userData.photo,
        userData.isAdmin, // Assuming isAdmin is passed as part of userData
        userData.store,   // Assuming store is passed as part of userData
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          // Custom error message
          return reject({ message: 'Error inserting user into database', error: err });
        }
        resolve(result.insertId);
      });
    } catch (error) {
      reject({ message: 'An error occurred while processing the request', error });
    }
  });
};

// Update a user
export const updateUser = (id, userData) => {
  return new Promise((resolve, reject) => {
    const query = `
            UPDATE users 
            SET username = ?, email = ?, password = ?, role_id = ? 
            WHERE id = ?
        `;
    db.query(query, [...Object.values(userData), id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows); // Return affected rows
    });
  });
};

// Delete a user
export const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM users WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows); // Return affected rows
    });
  });
};


export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT id, email, password, isAdmin, store, name
        FROM users
        WHERE email = ?;
      `;
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Error while querying DB:", err); // Afficher l'erreur dans les logs
        return reject(err);
      }
      if (results.length > 0) {
        resolve(results[0]); // Retourner l'utilisateur trouvé
      } else {
        resolve(null); // Retourner null si l'utilisateur n'existe pas
      }
    });
  });
};
