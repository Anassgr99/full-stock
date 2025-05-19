// productModel.js
import db from "../config/db.js";

// Get all products
export const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    const query = `
    SELECT 
        p.*,
        c.id AS category_id,
        c.name AS category_name,
        u.id AS unit_id,
        u.name AS unit_name
    FROM 
        products p
    LEFT JOIN 
        categories c ON p.category_id = c.id
    LEFT JOIN 
        units u ON p.unit_id = u.id
`;


    db.query(query, (err, results) => {
      if (err) return reject(err);

      // Map the results and structure category and unit as objects
      const parsedResults = results.map((product) => ({
        ...product,
        category: {
          id: product.category_id,
          name: product.category_name,
        },
        unit: {
          id: product.unit_id,
          name: product.unit_name,
        },
      }));

      // Clean up the additional fields used for mapping
      parsedResults.forEach((product) => {
        delete product.category_id;
        delete product.category_name;
        delete product.unit_id;
        delete product.unit_name;
      });

      resolve(parsedResults);
    });
  });
};

// Get product by ID
export const getProductById = (id) => {
  return new Promise((resolve, reject) => {
    // Query with join to fetch product details along with category and unit info
    const query = `
            SELECT 
                p.*, 
                c.name AS category_name,
                u.name AS unit_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN units u ON p.unit_id = u.id
            WHERE p.id = ?;
        `;
    db.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]); // Resolve with the first product result
    });
  });
};

// Create a new product and create store_product records for all stores
export const createProduct = (productData) => {
  return new Promise((resolve, reject) => {
    // Insert product into products table
    const query = `
      INSERT INTO products (
        name, slug, code, quantity, buying_price, selling_price, 
        quantity_alert, tax, tax_type, notes, product_image, category_id, unit_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, Object.values(productData), (err, result) => {
      if (err) return reject(err);
      
      const productId = result.insertId;

      // After inserting the product, get all stores from the stores table
      const getStoresQuery = `SELECT id FROM stores`;
      db.query(getStoresQuery, (err, stores) => {
        if (err) return reject(err);
        
        // For each store, create an entry in the store_product table.
        // For store with id=1, use the productData.quantity; for all others, quantity will be 0.
        const insertPromises = stores.map((store) => {
          const quantity = (store.id === 1) ? productData.quantity : 0;
          const insertStoreProductQuery = `
            INSERT INTO store_product (store_id, product_id, quantity)
            VALUES (?, ?, ?)
          `;
          return new Promise((resolve, reject) => {
            db.query(insertStoreProductQuery, [store.id, productId, quantity], (err, result) => {              
              if (err) {
                //console.error(`Error inserting into store_product for store ${store.id}:`, err);
                return reject(err);
              }
              resolve(result);
            });
          });
        });

        // Wait for all inserts into store_product to complete
        Promise.all(insertPromises)
          .then(() => resolve(result))
          .catch((err) => reject(err));
      });
    });
  });
};

// Update a product
export const updateProduct = (id, productData) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE products SET name = ?, slug = ?, code = ?, quantity = ?, buying_price = ?, 
                        selling_price = ?, quantity_alert = ?, tax = ?, tax_type = ?, notes = ?, 
                        product_image = ?, category_id = ?, unit_id = ? WHERE id = ?`;
    db.query(query, [...Object.values(productData), id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

// Delete a product
export const deleteProduct = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM products WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};
export const getUnit = (id) => {
  return new Promise((resolve, reject) => {
    // Define the SQL query with a JOIN between products and units
    const query = `
            SELECT 
                p.id AS product_id, 
                p.name AS product_name, 
                p.unit_id, 
                u.name AS unit_name,
                CASE 
                    WHEN p.unit_id = 1 THEN 'Meters' 
                    ELSE u.name 
                END AS display_unit
            FROM products p
            JOIN units u ON p.unit_id = u.id
            WHERE p.unit_id = ?;
        `;

    // Execute the query
    db.query(query, [id], (err, result) => {
      if (err) {
        return reject(err); // Reject promise on error
      }
      resolve(result); // Resolve the promise with the query result
    });
  });
};

// Get products by category ID
export const getProductsByCategoryId = (categoryId) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT 
                p.*, 
                c.name AS category_name,
                u.name AS unit_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN units u ON p.unit_id = u.id
            WHERE p.category_id = ?;
        `;
    db.query(query, [categoryId], (err, results) => {
      if (err) return reject(err);

      // Map the results to include category and unit as objects
      const parsedResults = results.map((product) => ({
        ...product,
        category: {
          id: product.category_id,
          name: product.category_name,
        },
        unit: {
          id: product.unit_id,
          name: product.unit_name,
        },
      }));

      // Remove unnecessary fields used for mapping
      parsedResults.forEach((product) => {
        delete product.category_id;
        delete product.category_name;
        delete product.unit_id;
        delete product.unit_name;
      });

      resolve(parsedResults); // Resolve with parsed results
    });
  });
};

// Fetch stock quantities from the database
export const getStockQuantities = () => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT product_id, store_id, quantity 
            FROM store_product
        `;

    db.query(query, (err, results) => {
      if (err) {
        return reject(err);
      }

      // Directly resolve the results as an array of stock quantities
      const stockQuantities = results.map((row) => ({
        product_id: row.product_id,
        store_id: row.store_id,
        quantity: row.quantity,
      }));

      resolve(stockQuantities);
    });
  });
};
export const getStockQuantitiesById = (storeId) => {
  return new Promise((resolve, reject) => {
    const query = `
          SELECT 
    sp.product_id, 
    sp.store_id, 
    sp.quantity,
    p.name AS product_name,
    p.selling_price,
    p.buying_price,
    p.category_id,  
    s.store_name AS store_name
FROM store_product sp
JOIN products p ON sp.product_id = p.id
JOIN stores s ON sp.store_id = s.id
WHERE sp.store_id = ?;
        `;

    db.query(query, [storeId], (err, results) => {
      if (err) {
        //console.error("Error executing query:", err); // Log the error for debugging
        return reject(err); // Reject the promise with the error
      }

      // Map the results into a more structured format

      const stockQuantities = results.map((row) => ({
        product_id: row.product_id,
        store_id: row.store_id,
        quantity: row.quantity,
        product_name: row.product_name,
        store_name: row.store_name,
        buying_price: row.buying_price,
        selling_price: row.selling_price,
        category_id: row.category_id,
      }));

      resolve(stockQuantities); // Resolve the promise with the mapped results
    });
  });
};
