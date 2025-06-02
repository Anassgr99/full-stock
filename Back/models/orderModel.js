import db from "../config/db.js";

// Get all orders
export const getAllOrders = async () => {
  const [results] = await db.query(`
    SELECT 
      o.*,
      o.id AS order_id,
      o.order_date,
      o.total,
      c.name AS customer_name,
      s.store_name,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) AS order_store,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) AS product_id,
      pr.name AS product_name,
      pr.buying_price AS buying_price,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.quantity')) AS quantity
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN (
      SELECT o.id AS order_id, JSON_EXTRACT(o.products, CONCAT('$[', n.n, ']')) AS json_value
      FROM orders o
      JOIN (
        SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
      ) n ON n.n < JSON_LENGTH(o.products)
    ) p ON p.order_id = o.id
    JOIN stores s ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) = s.id
    JOIN products pr ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) = pr.id
    ORDER BY o.order_date DESC
  `);
  return results;
};

// Get order by ID
export const getOrderById = async (id) => {
  const [results] = await db.query(`
    SELECT 
      o.*,
      o.id AS order_id,
      o.order_date,
      o.total AS order_total,
      c.name AS customer_name,
      s.store_name,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) AS order_store,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) AS product_id,
      pr.name AS product_name,
      pr.buying_price AS buying_price,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.quantity')) AS quantity,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.unitcost')) AS unitcost,
      JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.total')) AS product_total
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN (
      SELECT o.id AS order_id, JSON_EXTRACT(o.products, CONCAT('$[', n.n, ']')) AS json_value
      FROM orders o
      JOIN (
        SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
      ) n ON n.n < JSON_LENGTH(o.products)
    ) p ON p.order_id = o.id
    JOIN stores s ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) = s.id
    JOIN products pr ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) = pr.id
    WHERE o.id = ?
  `, [id]);

  if (!results.length) return null;

  return {
    order_id: results[0].order_id,
    invoice_no: results[0].invoice_no,
    order_date: results[0].order_date,
    payment_type: results[0].payment_type,
    total: results[0].total,
    customer_name: results[0].customer_name,
    store_name: results[0].store_name,
    products: results.map(row => ({
      product_id: row.product_id,
      product_name: row.product_name,
      quantity: row.quantity,
      buying_price:  row.buying_price,
      unitcost: row.unitcost,
      total: row.product_total
    }))
  };
};

// Create a new order
export const createOrder = async (orderData) => {
  const insertOrderQuery = `
    INSERT INTO orders (
      customer_id, order_date, total_products, sub_total, vat, total,
      invoice_no, payment_type, pay, due, created_at, updated_at, products
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const orderValues = [
    orderData.customer_id,
    orderData.order_date,
    orderData.total_products,
    orderData.sub_total,
    orderData.vat,
    orderData.total,
    orderData.invoice_no,
    orderData.payment_type,
    orderData.pay,
    orderData.due,
    orderData.created_at || new Date(),
    orderData.updated_at || new Date(),
    JSON.stringify(orderData.products)
  ];

  const [insertResult] = await db.query(insertOrderQuery, orderValues);
  const orderId = insertResult.insertId;

  // Update product quantities in store_product
  const updateStoreProductQuery = `
    UPDATE store_product
    SET quantity = quantity - ?
    WHERE product_id = ? AND store_id = ?
  `;

  for (const product of orderData.products) {
    const values = [product.quantity, product.product_id, product.order_store];
    await db.query(updateStoreProductQuery, values);
  }

  return orderId;
};

// Update an existing order
export const updateOrder = async (id, orderData) => {
  const [result] = await db.query(`
    UPDATE orders
    SET payment_type = ?, updated_at = NOW()
    WHERE id = ?
  `, [orderData.payment_type, id]);

  return result.affectedRows;
};

// Delete an order
export const deleteOrder = async (id) => {
  const [result] = await db.query("DELETE FROM orders WHERE id = ?", [id]);
  return result.affectedRows;
};
