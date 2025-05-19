import db from "../config/db.js";

// /**
//  * Creates a new product and inserts corresponding store_product records for all stores.
//  * For the store with id = 1, uses the provided product quantity; for all other stores, sets quantity to 0.
//  * @param {Object} productData - Object containing product data.
//  * @returns {Promise} - Resolves with the product insertion result after store_product records are created.
//  */
// export const createProductWithStores = (productData) => {
//   return new Promise((resolve, reject) => {
//     // Insert product into the products table
//     const insertQuery = `
//       INSERT INTO products 
//       (name, slug, code, quantity, buying_price, selling_price, quantity_alert, tax, tax_type, notes, product_image, category_id, unit_id, created_at, updated_at)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//     `;
    
//     // Extract product values and provide defaults for unspecified fields
//     const {
//       name,
//       slug,
//       code,
//       quantity,
//       buying_price,
//       selling_price,
//       quantity_alert,
//       notes,
//       category_id,
//     } = productData;
//     const tax = 0;
//     const tax_type = 0;
//     const product_image = "";
//     const unit_id = 2;
    
//     db.query(
//       insertQuery,
//       [
//         name,
//         slug,
//         code,
//         quantity,
//         buying_price,
//         selling_price,
//         quantity_alert,
//         tax,
//         tax_type,
//         notes,
//         product_image,
//         category_id,
//         unit_id,
//       ],
//       (err, result) => {
//         if (err) return reject(err);
//         const productId = result.insertId;
        
//         // After the product is created, get all stores
//         const getStoresQuery = `SELECT id FROM stores`;
//         db.query(getStoresQuery, (err, stores) => {
//           if (err) return reject(err);
          
//           // For each store, create a store_product record.
//           // For store with id=1, use the productData.quantity; for all others, set quantity to 0.
//           const insertPromises = stores.map((store) => {
//             const storeQuantity = (store.id === 1) ? quantity : 0;
//             const insertStoreProductQuery = `
//               INSERT INTO store_product (store_id, product_id, quantity)
//               VALUES (?, ?, ?)
//             `;
//             return new Promise((resolve, reject) => {
//               db.query(
//                 insertStoreProductQuery,
//                 [store.id, productId, storeQuantity],
//                 (err, res) => {
//                   if (err) {
//                     //console.error(`Error inserting store_product for store ${store.id}:`, err);
//                     return reject(err);
//                   }
//                   resolve(res);
//                 }
//               );
//             });
//           });
          
//           // Wait for all store_product records to be inserted
//           Promise.all(insertPromises)
//             .then(() => resolve(result))
//             .catch((error) => reject(error));
//         });
//       }
//     );
//   });
// };


/**
 * Creates a new product and inserts corresponding store_product records for all stores.
 * For the store with id = 1, uses the provided product quantity; for all other stores, sets quantity to 0.
 * The productData object must include 'category_name' and 'category_slug' properties.
 * The function looks up the category by its name and slug.
 * If a matching category is found, its id is used in the product insert; if not, the product insertion fails.
 *
 * @param {Object} productData - Object containing product data.
 * @returns {Promise} - Resolves with the product insertion result after store_product records are created.
 */
export const createProductWithStores = (productData) => {
  return new Promise((resolve, reject) => {
    // Extract category properties from productData
    const { category_name, category_slug } = productData;

    // Query the category by name and slug.
    // The category table has a unique index on slug; here we ensure both name and slug match.
    const findCategoryQuery = `SELECT id FROM categories WHERE name = ? AND slug = ?`;
    db.query(findCategoryQuery, [category_name, category_slug], (err, categoryResults) => {
      if (err) return reject(err);
      if (!categoryResults || categoryResults.length === 0) {
        return reject(new Error(`Category with name "${category_name}" and slug "${category_slug}" not found.`));
      }
      
      // Use the found category id for the product insertion
      const category_id = categoryResults[0].id;

      // Insert product into the products table
      const insertQuery = `
        INSERT INTO products 
        (name, slug, code, quantity, buying_price, selling_price, quantity_alert, tax, tax_type, notes, product_image, category_id, unit_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      // Extract product values and provide defaults for unspecified fields
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
      
      db.query(
        insertQuery,
        [
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
        ],
        (err, result) => {
          if (err) return reject(err);
          const productId = result.insertId;
          
          // After the product is created, get all stores
          const getStoresQuery = `SELECT id FROM stores`;
          db.query(getStoresQuery, (err, stores) => {
            if (err) return reject(err);
            
            // For each store, create a store_product record.
            // For store with id=1, use the productData.quantity; for all others, set quantity to 0.
            const insertPromises = stores.map((store) => {
              const storeQuantity = (store.id === 1) ? quantity : 0;
              const insertStoreProductQuery = `
                INSERT INTO store_product (store_id, product_id, quantity)
                VALUES (?, ?, ?)
              `;
              return new Promise((resolve, reject) => {
                db.query(
                  insertStoreProductQuery,
                  [store.id, productId, storeQuantity],
                  (err, res) => {
                    if (err) return reject(err);
                    resolve(res);
                  }
                );
              });
            });
            
            // Wait for all store_product records to be inserted
            Promise.all(insertPromises)
              .then(() => resolve(result))
              .catch((error) => reject(error));
          });
        }
      );
    });
  });
};


export const createOrUpdateProductWithStores = (productData, storeId = "1") => {
  return new Promise((resolve, reject) => {
    // First, check if the product exists (assuming "code" is unique)
    const findProductQuery = `SELECT id FROM products WHERE code = ?`;
    db.query(findProductQuery, [productData.code], (err, productResults) => {
      if (err) return reject(err);

      if (productResults && productResults.length > 0) {
        // Product exists, update the store_product record for the given store
        const productId = productResults[0].id;
        const updateQuery = `
          UPDATE store_product 
          SET quantity = ?
          WHERE store_id = ? AND product_id = ?
        `;
        db.query(updateQuery, [productData.quantity, storeId, productId], (err, result) => {
          if (err) return reject(err);
          // If no row was updated, it means the record might not exist.
          if (result.affectedRows === 0) {
            // Insert the missing store_product record for the given store
            const insertStoreProductQuery = `
              INSERT INTO store_product (store_id, product_id, quantity)
              VALUES (?, ?, ?)
            `;
            return db.query(
              insertStoreProductQuery,
              [storeId, productId, productData.quantity],
              (err, insertResult) => {
                if (err) return reject(err);
                return resolve(insertResult);
              }
            );
          }
          return resolve(result);
        });
      } else {
        // If product does not exist, proceed with inserting the new product
        const { category_name, category_slug } = productData;
        const findCategoryQuery = `SELECT id FROM categories WHERE name = ? AND slug = ?`;
        db.query(findCategoryQuery, [category_name, category_slug], (err, categoryResults) => {
          if (err) return reject(err);
          if (!categoryResults || categoryResults.length === 0) {
            return reject(new Error(`Category with name "${category_name}" and slug "${category_slug}" not found.`));
          }
          const category_id = categoryResults[0].id;
          
          const insertQuery = `
            INSERT INTO products 
            (name, slug, code, quantity, buying_price, selling_price, quantity_alert, tax, tax_type, notes, product_image, category_id, unit_id, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `;
          const { name, slug, code, quantity, buying_price, selling_price, quantity_alert, notes } = productData;
          const tax = 0, tax_type = 0, product_image = "", unit_id = 2;
          
          db.query(
            insertQuery,
            [
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
            ],
            (err, result) => {
              if (err) return reject(err);
              const productId = result.insertId;
              
              // For a new product, create store_product rows for all stores
              const getStoresQuery = `SELECT id FROM stores`;
              db.query(getStoresQuery, (err, stores) => {
                if (err) return reject(err);
                
                const insertPromises = stores.map((store) => {
                  const storeQuantity = (store.id.toString() === storeId) ? quantity : 0;
                  const insertStoreProductQuery = `
                    INSERT INTO store_product (store_id, product_id, quantity)
                    VALUES (?, ?, ?)
                  `;
                  return new Promise((resolve, reject) => {
                    db.query(
                      insertStoreProductQuery,
                      [store.id, productId, storeQuantity],
                      (err, res) => {
                        if (err) return reject(err);
                        resolve(res);
                      }
                    );
                  });
                });
    
                Promise.all(insertPromises)
                  .then(() => resolve(result))
                  .catch((error) => reject(error));
              });
            }
          );
        });
      }
    });
  });
};
