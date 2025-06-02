import db from "../config/db.js";

// Get all products
export const getAllProducts = async () => {
  const [results] = await db.query(`
    SELECT 
      p.*, 
      c.id AS category_id, c.name AS category_name, c.icon AS category_icon,
      u.id AS unit_id, u.name AS unit_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN units u ON p.unit_id = u.id
  `);

  const parsedResults = results.map((product) => {
    const p = {
      ...product,
      category: { id: product.category_id, name: product.category_name, icon: product.category_icon },
      unit: { id: product.unit_id, name: product.unit_name},
    };
    delete p.category_id;
    delete p.category_name;
    delete p.category_icon;
    delete p.unit_id;
    delete p.unit_name;
    return p;
  });

  return parsedResults;
};

// Get product by ID
export const getProductById = async (id) => {
  const [results] = await db.query(`
    SELECT 
      p.*, 
      c.name AS category_name, 
      c.icon AS category_icon,
      u.name AS unit_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN units u ON p.unit_id = u.id
    WHERE p.id = ?
  `, [id]);

  return results[0];
};

// Create a new product and store_product records
export const createProduct = async (productData) => {
  const insertProductQuery = `
    INSERT INTO products (
      name, slug, code, quantity, buying_price, selling_price, 
      quantity_alert, tax, tax_type, notes, product_image, category_id, unit_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(insertProductQuery, Object.values(productData));
  const productId = result.insertId;

  const [stores] = await db.query("SELECT id FROM stores");

  for (const store of stores) {
    const quantity = store.id === 1 ? productData.quantity : 0;
    await db.query(`
      INSERT INTO store_product (store_id, product_id, quantity)
      VALUES (?, ?, ?)
    `, [store.id, productId, quantity]);
  }

  return result;
};

// Update a product
export const updateProduct = async (id, productData) => {
  const query = `
    UPDATE products SET 
      name = ?, slug = ?, code = ?, quantity = ?, buying_price = ?, 
      selling_price = ?, quantity_alert = ?, tax = ?, tax_type = ?, notes = ?, 
      product_image = ?, category_id = ?, unit_id = ? 
    WHERE id = ?
  `;

  const [result] = await db.query(query, [...Object.values(productData), id]);
  return result.affectedRows;
};

// Delete a product
export const deleteProduct = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows;
};

// Get unit by ID
export const getUnit = async (id) => {
  const [result] = await db.query(`
    SELECT 
      p.id AS product_id, p.name AS product_name, 
      p.unit_id, u.name AS unit_name,
      CASE WHEN p.unit_id = 1 THEN 'Meters' ELSE u.name END AS display_unit
    FROM products p
    JOIN units u ON p.unit_id = u.id
    WHERE p.unit_id = ?
  `, [id]);

  return result;
};

// Get products by category ID
export const getProductsByCategoryId = async (categoryId) => {
  const [results] = await db.query(`
    SELECT 
      p.*, 
      c.name AS category_name,
      u.name AS unit_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN units u ON p.unit_id = u.id
    WHERE p.category_id = ?
  `, [categoryId]);

  const parsedResults = results.map((product) => {
    const p = {
      ...product,
      category: { id: product.category_id, name: product.category_name },
      unit: { id: product.unit_id, name: product.unit_name },
    };
    delete p.category_id;
    delete p.category_name;
    delete p.unit_id;
    delete p.unit_name;
    return p;
  });

  return parsedResults;
};

// Get all stock quantities
export const getStockQuantities = async () => {
  const [results] = await db.query(`
    SELECT product_id, store_id, quantity FROM store_product
  `);

  return results.map((row) => ({
    product_id: row.product_id,
    store_id: row.store_id,
    quantity: row.quantity,
  }));
};

// Get stock quantities by store ID
export const getStockQuantitiesById = async (storeId) => {
  const [results] = await db.query(`
    SELECT 
      sp.product_id, sp.store_id, sp.quantity,
      p.name AS product_name, p.selling_price, p.buying_price, p.category_id,
      s.store_name
    FROM store_product sp
    JOIN products p ON sp.product_id = p.id
    JOIN stores s ON sp.store_id = s.id
    WHERE sp.store_id = ?
  `, [storeId]);

  return results.map((row) => ({
    product_id: row.product_id,
    store_id: row.store_id,
    quantity: row.quantity,
    product_name: row.product_name,
    store_name: row.store_name,
    buying_price: row.buying_price,
    selling_price: row.selling_price,
    category_id: row.category_id,
  }));
};
