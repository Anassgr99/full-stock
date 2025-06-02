import db from "../config/db.js";

// Create new product + insert in all stores
export const createProductWithStores = async (productData) => {
  const { category_name, category_slug } = productData;

  const [categoryResults] = await db.query(
    `SELECT id FROM categories WHERE name = ? AND slug = ?`,
    [category_name, category_slug]
  );

  if (!categoryResults.length) {
    throw new Error(`Category with name "${category_name}" and slug "${category_slug}" not found.`);
  }

  const category_id = categoryResults[0].id;

  const {
    name,
    slug,
    code,
    quantity,
    buying_price,
    selling_price,
    quantity_alert,
    notes,
  } = productData;

  const tax = 0;
  const tax_type = 0;
  const product_image = "";
  const unit_id = 2;

  const [result] = await db.query(`
    INSERT INTO products 
    (name, slug, code, quantity, buying_price, selling_price, quantity_alert, tax, tax_type, notes, product_image, category_id, unit_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `, [
    name,
    slug,
    code,
    quantity,
    buying_price,
    selling_price,
    quantity_alert,
    tax,
    tax_type,
    notes,
    product_image,
    category_id,
    unit_id,
  ]);

  const productId = result.insertId;

  const [stores] = await db.query(`SELECT id FROM stores`);
  for (const store of stores) {
    const storeQuantity = (store.id === 1) ? quantity : 0;
    await db.query(
      `INSERT INTO store_product (store_id, product_id, quantity) VALUES (?, ?, ?)`,
      [store.id, productId, storeQuantity]
    );
  }

  return result;
};


// Update if exists, or create properly by store
export const createOrUpdateProductWithStores = async (productData, storeId = "1") => {
  const [productResults] = await db.query(
    `SELECT id FROM products WHERE code = ?`,
    [productData.code]
  );

  const {
    name,
    slug,
    buying_price,
    selling_price,
    quantity_alert,
    notes,
    category_name,
    category_slug,
    code,
    quantity,
  } = productData;

  const tax = 0;
  const tax_type = 0;
  const product_image = "";
  const unit_id = 2;

  let productId;

  if (productResults.length > 0) {
    // Produit existe -> update product info
    productId = productResults[0].id;

    await db.query(`
      UPDATE products 
      SET name = ?, slug = ?, buying_price = ?, selling_price = ?, quantity_alert = ?, notes = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, slug, buying_price, selling_price, quantity_alert, notes, productId]);

  } else {
    // Produit nouveau
    const [categoryResults] = await db.query(
      `SELECT id FROM categories WHERE name = ? AND slug = ?`,
      [category_name, category_slug]
    );

    if (!categoryResults.length) {
      throw new Error(`Category with name "${category_name}" and slug "${category_slug}" not found.`);
    }

    const category_id = categoryResults[0].id;

    const [insertProduct] = await db.query(`
      INSERT INTO products 
      (name, slug, code, quantity, buying_price, selling_price, quantity_alert, tax, tax_type, notes, product_image, category_id, unit_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      name,
      slug,
      code,
      quantity,
      buying_price,
      selling_price,
      quantity_alert,
      tax,
      tax_type,
      notes,
      product_image,
      category_id,
      unit_id,
    ]);

    productId = insertProduct.insertId;
  }

  // Store spécifique: insert or update uniquement dans storeId
  const [existing] = await db.query(
    `SELECT * FROM store_product WHERE store_id = ? AND product_id = ?`,
    [storeId, productId]
  );

  if (existing.length > 0) {
    await db.query(`
      UPDATE store_product SET quantity = ? 
      WHERE store_id = ? AND product_id = ?
    `, [quantity, storeId, productId]);
  } else {
    await db.query(`
      INSERT INTO store_product (store_id, product_id, quantity)
      VALUES (?, ?, ?)
    `, [storeId, productId, quantity]);
  }

  return { message: 'Product created or updated correctly' };
};
