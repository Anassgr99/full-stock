import db from "../config/db.js";

// Get all orders
export const getAllOrders = () => {
  return new Promise((resolve, reject) => {
    const query = `
     SELECT 
    o.*,
      o.*, 
    o.id AS order_id,
    o.order_date,
    o.total,
    c.name AS customer_name,
    s.store_name,
    JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) AS order_store,
    JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) AS product_id,
    pr.name AS product_name,
    JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.quantity')) AS quantity -- Extracting quantity from the JSON
FROM 
    orders o
JOIN 
    customers c ON o.customer_id = c.id
JOIN 
    (
        SELECT 
            o.id AS order_id,
            JSON_EXTRACT(o.products, CONCAT('$[', n.n, ']')) AS json_value
        FROM 
            orders o
        JOIN 
            (
                SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
            ) n -- Adjust the range based on the maximum number of products in the JSON array
            ON n.n < JSON_LENGTH(o.products)
    ) p ON p.order_id = o.id
JOIN 
    stores s ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) = s.id
JOIN 
    products pr ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) = pr.id
ORDER BY 
    o.order_date DESC
LIMIT 0, 25;

    `;
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Get order by ID
export const getOrderById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `
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
   JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.quantity')) AS quantity,
   JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.unitcost')) AS unitcost,
   JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.total')) AS product_total
FROM 
   orders o
JOIN 
   customers c ON o.customer_id = c.id
JOIN 
   (
       SELECT 
           o.id AS order_id,
           JSON_EXTRACT(o.products, CONCAT('$[', n.n, ']')) AS json_value
       FROM 
           orders o
       JOIN 
           (
               SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
           ) n
           ON n.n < JSON_LENGTH(o.products)
   ) p ON p.order_id = o.id
JOIN 
   stores s ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.order_store')) = s.id
JOIN 
   products pr ON JSON_UNQUOTE(JSON_EXTRACT(p.json_value, '$.product_id')) = pr.id
WHERE o.id = ?;
       `;
       db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
      
        // Group the order-level info and aggregate product rows
        const order = {
          order_id: results[0].order_id,
          invoice_no: results[0].invoice_no,
          order_date: results[0].order_date,
          payment_type: results[0].payment_type,
          total: results[0].total,
          customer_name: results[0].customer_name,
          store_name: results[0].store_name,
          // Include other order-level fields as needed
          products: results.map(row => ({
            product_id: row.product_id,
            product_name: row.product_name,
            quantity: row.quantity,
            unitcost: row.unitcost,
            total: row.product_total 
          }))
        };
  
        resolve(order);
      });
    });
  };

// Create a new order
export const createOrder = (orderData) => {
  return new Promise((resolve, reject) => {
    const insertOrderQuery = `
      INSERT INTO orders (
          customer_id, 
          order_date, 
          total_products, 
          sub_total, 
          vat, 
          total, 
          invoice_no, 
          payment_type, 
          pay, 
          due, 
          created_at, 
          updated_at, 
          products
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const orderValues = [
      orderData.customer_id,
      orderData.order_date,
      // orderData.order_status,
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
      JSON.stringify(orderData.products), // Save products as JSON
    ];

    // Insert the order first
    db.query(insertOrderQuery, orderValues, (err, result) => {
      if (err) {
        console.error("Error inserting order:", err);
        return reject(err);
      }

      const orderId = result.insertId;

      // Update product quantities ONLY in store_product table
      const updateStoreProductQuery = `
        UPDATE store_product
        SET quantity = quantity - ?
        WHERE product_id = ? AND store_id = ?
      `;

      const updatePromises = orderData.products.map((product) => {
        const updateStoreValues = [
          product.quantity,       // The quantity to subtract
          product.product_id,     // The product ID
          product.order_store,    // The store ID (assuming order_store holds the store_id)
        ];
        return new Promise((resolve, reject) => {
          db.query(updateStoreProductQuery, updateStoreValues, (err) => {
            if (err) {
              // console.error(
              //   `Error updating store_product for product_id ${product.product_id}:`,
              //   err
              // );
              return reject(err);
            }
            resolve();
          });
        });
      });

      // Wait for all updates to complete
      Promise.all(updatePromises)
        .then(() => resolve(orderId))
        .catch((updateError) => {
          console.error("Error updating store_product quantities:", updateError);
          reject(updateError);
        });
    });
  });
};


// Update an existing order
export const updateOrder = (id, orderData) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE orders
      SET payment_type = ?,
          updated_at = NOW()
      WHERE id = ?
    `;
    db.query(query, [orderData.payment_type, id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

// Delete an order
export const deleteOrder = (id) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM orders WHERE id = ?";
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};
