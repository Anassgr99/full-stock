import db from "../config/db.js";

// Get all categories
export const getAllCategories = async () => {
  const [results] = await db.query("SELECT * FROM categories");
  return results;
};

// Get category by ID
export const getCategoryById = async (id) => {
  const [results] = await db.query("SELECT * FROM categories WHERE id = ?", [id]);
  return results[0];
};

// Create category 
export const createCategory = async (categoryData) => {
  const bgColor = categoryData.bg || "#ffffff"; // Default color if not provided

  const [result] = await db.query(
    `INSERT INTO categories (name, slug, created_at, updated_at, bg, icon) VALUES (?, ?, ?, ?, ?, ?)`,
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
};

// Update a category
export const updateCategory = async (id, { name, slug, icon }) => {
  const [result] = await db.query(
    `UPDATE categories SET name = ?, slug = ?, icon = ? WHERE id = ?`,
    [name, slug, icon, id]
  );
  return result;
};

// Delete a category
export const deleteCategory = async (id) => {
  const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
  return result;
};
