import db from "../config/db.js";

/**
 * Retrieves all products with their category information for Excel export.
 * @returns {Promise<Array>} - Array of product objects.
 */
export const getAllProductsForExcel = async () => {
  const [results] = await db.query(`
    SELECT 
      p.name,
      p.slug,
      p.code,
      p.quantity,
      p.buying_price,
      p.selling_price,
      p.quantity_alert,
      p.notes,
      c.name AS category_name,
      c.slug AS category_slug
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.name
  `);
  return results;
};

// Get all return entries
export const getAllRetourner = async () => {
  const [results] = await db.query(`SELECT * FROM retourner`);
  return results;
};

// Get all orders with details for Excel
export const getAllOrdersForExcel = async () => {
  const [results] = await db.query(`
    SELECT
      o.id               AS order_id,
      o.invoice_no       AS invoice_no,
      o.order_date       AS order_date,
      o.payment_type     AS payment_type,
      o.total            AS total,
      c.name             AS customer_name,
      ANY_VALUE(s.store_name)   AS store_name,
      GROUP_CONCAT(pr.name ORDER BY pr.name SEPARATOR ', ') AS product_names
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN (
      SELECT
        o.id AS order_id,
        JSON_EXTRACT(o.products, CONCAT('$[', n.n, ']')) AS json_value
      FROM orders o
      JOIN (
        SELECT 0 AS n UNION SELECT 1 UNION SELECT 2
        UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
      ) n ON n.n < JSON_LENGTH(o.products)
    ) p ON p.order_id = o.id
    JOIN stores s ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) = s.id
    JOIN products pr ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) = pr.id
    GROUP BY
      o.id,
      o.invoice_no,
      o.order_date,
      o.payment_type,
      o.total,
      c.name
    ORDER BY o.order_date DESC
  `);
  return results;
};

// Get store product quantities for Excel
export const getAllStoreProductsForExcel = async () => {
  const [results] = await db.query(`
    SELECT 
      p.name AS product_name,
      SUM(CASE WHEN sp.store_id = 1 THEN sp.quantity ELSE 0 END) AS store1_quantity,
      SUM(CASE WHEN sp.store_id = 2 THEN sp.quantity ELSE 0 END) AS store2_quantity,
      SUM(CASE WHEN sp.store_id = 3 THEN sp.quantity ELSE 0 END) AS store3_quantity
    FROM store_product sp
    JOIN products p ON sp.product_id = p.id
    GROUP BY p.name
    ORDER BY p.name
  `);
  return results;
};
