// categoryModel.js
import db from "../config/db.js";

// Get all categories
export const getAllCategories = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM categories"; // SQL query for fetching all categories

    // Execute the query
    db.query(query, (err, results) => {
      if (err) {
        // Reject the promise if there is an error
        reject(err);
      } else {
        // Resolve the promise with the query results
        resolve(results);
      }
    });
  });
};



// Get category by ID
export const getCategoryById = async (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM categories WHERE id = ?`;
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // Return the first category as an object
    });
  });
};

// Create category 
export const createCategory = async (categoryData) => {
  const bgColor = categoryData.bg || "#ffffff"; // Default color if not provided

  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO categories (name, slug, created_at, updated_at, bg, icon) VALUES (?, ?, ?, ?, ?, ?)",
        [
          categoryData.name,
          categoryData.slug,
          new Date(),
          new Date(),
          bgColor,
          categoryData.icon,
        ]
      );
    return result;
  } catch (error) {
    //console.error("Database error:", error);
    throw error;
  }
};

// Update a category
export const updateCategory = (id, { name, slug, icon }) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE categories
      SET name = ?, slug = ?, icon = ?
      WHERE id = ?
    `;
    db.query(query, [name, slug,icon, id], (err, results) => {
      if (err) return reject(err);
      resolve(results); // Ensure this returns the results object
    });
  });
};


// Delete a category
export const deleteCategory = async (id) => {
  const [result] = await db
    .promise()
    .query("DELETE FROM categories WHERE id = ?", [id]);
  return result;
};
