import db from "../config/db.js";

/**
 * Réduit une quantité d'un produit dans un magasin.
 * 
 * - Si storeId === 1 : on retire simplement la quantité demandée dans le magasin principal.
 * - Sinon (storeId ≠ 1) : on retire la quantité du magasin cible et on la remet dans le magasin principal (1).
 */
export const reduceProductFromStore = async (storeId, productId, userQuantity) => {
  // Vérification basique
  if (!storeId || !productId || typeof userQuantity !== 'number' || userQuantity <= 0) {
    const err = new Error("Entrée invalide : storeId, productId et userQuantity (> 0) sont obligatoires.");
    err.status = 400;
    throw err;
  }

  // 1) Cas : magasin principal (storeId = 1) → on retire directement du stock principal
  if (storeId === 1) {
    // On récupère d'abord la quantité actuelle dans le store 1
    const [fetchResults] = await db.query(
      `SELECT quantity
         FROM store_product
        WHERE store_id = 1 AND product_id = ?;`,
      [productId]
    );
    const currentQty = fetchResults[0]?.quantity || 0;

    if (userQuantity > currentQty) {
      const err = new Error("Quantité à retirer dépasse le stock disponible dans le magasin 1.");
      err.status = 400;
      throw err;
    }

    // On met à jour (déduit) la quantité dans store 1
    const updateQuery = `
      UPDATE store_product
         SET quantity = quantity - ?
       WHERE store_id = 1 AND product_id = ?;
    `;
    const [updateResults] = await db.query(updateQuery, [userQuantity, productId]);
    return updateResults;
  }

  // 2) Cas : magasin secondaire (storeId ≠ 1)
  //    → on retire du magasin cible ET on réinjecte dans le magasin principal (1)

  // 2a) Récupérer la quantité actuelle dans le magasin cible
  const [fetchTarget] = await db.query(
    `SELECT quantity
       FROM store_product
      WHERE store_id = ? AND product_id = ?;`,
    [storeId, productId]
  );
  const targetQty = fetchTarget[0]?.quantity || 0;

  if (userQuantity > targetQty) {
    const err = new Error("Quantité à retirer dépasse le stock disponible dans le magasin désigné.");
    err.status = 400;
    throw err;
  }

  // 2b) Récupérer la quantité actuelle dans le magasin principal (pour réinjection)
  const [fetchMain] = await db.query(
    `SELECT quantity
       FROM store_product
      WHERE store_id = 1 AND product_id = ?;`,
    [productId]
  );
  const mainQty = fetchMain[0]?.quantity || 0;

  // 2c) Appliquer la mise à jour en une seule requête si possible
  //     ON CASCADE (UPDATE) : décrémente du magasin cible, puis incrémente dans le magasin 1
  const updateQuery = `
    UPDATE store_product
       SET quantity = CASE
         WHEN store_id = ? THEN quantity - ?
         WHEN store_id = 1 THEN quantity + ?
       END
     WHERE product_id = ? AND (store_id = ? OR store_id = 1);
  `;
  const params = [storeId, userQuantity, userQuantity, productId, storeId];
  const [updateResults] = await db.query(updateQuery, params);

  // 2d) Si, pour quelque raison, il n'y avait pas encore de ligne pour storeId dans store_product,
  //     alors on doit créer cette ligne (avec la quantité déjà modifiée), puis réinjecter dans le store 1.
  //     Cependant, dans notre logique, on sait que si targetQty ≥ userQuantity,
  //     alors une ligne existe toujours pour (storeId, productId).

  return updateResults;
};

// Add a product to a store
export const addProductToStore = async (storeId, productId, userQuantity) => {
  if (storeId === 1) {
    const updateQuery = `
      UPDATE store_product 
      SET quantity = ?
      WHERE store_id = ? AND product_id = ?;
    `;
    const [updateResults] = await db.query(updateQuery, [userQuantity, storeId, productId]);
    return updateResults;
  } else {
    const fetchQuery = `
      SELECT quantity FROM store_product 
      WHERE store_id = 1 AND product_id = ?;
    `;
    const [fetchResults] = await db.query(fetchQuery, [productId]);
    const store1Quantity = fetchResults[0]?.quantity || 0;

    if (userQuantity <= store1Quantity) {
      const checkPairQuery = `
        SELECT * FROM store_product 
        WHERE store_id = ? AND product_id = ?;
      `;
      const [checkResults] = await db.query(checkPairQuery, [storeId, productId]);

      if (checkResults.length > 0) {
        const updateQuery = `
          UPDATE store_product
          SET quantity = CASE
            WHEN store_id = 1 THEN quantity - ?
            WHEN store_id = ? THEN quantity + ?
          END
          WHERE product_id = ? AND (store_id = 1 OR store_id = ?);
        `;
        const [updateResults] = await db.query(updateQuery, [
          userQuantity, storeId, userQuantity, productId, storeId
        ]);
        return updateResults;
      } else {
        const insertQuery = `
          INSERT INTO store_product (store_id, product_id, quantity)
          VALUES (?, ?, ?);
        `;
        const [insertResults] = await db.query(insertQuery, [storeId, productId, userQuantity]);
        return insertResults;
      }
    } else {
      throw {
        response: {
          status: 400,
          data: {
            message: "Quantity from user must be less than quantity in store_id = 1.",
          },
        },
      };
    }
  }
};

// Get product quantity by store
export const getStoreProducts = async (storeId) => {
  const [results] = await db.query(`
    SELECT p.name AS product_name, sp.quantity
    FROM store_product sp
    JOIN products p ON sp.product_id = p.id
    WHERE sp.product_id = ?;
  `, [storeId]);

  return results;
};

// Get all store products
export const getAllStoreProductsModel = async (storeId) => {
  const [results] = await db.query(`
    SELECT 
      sp.id,
      sp.store_id,
      sp.product_id,
      sp.quantity,
      p.quantity_alert,
      sp.created_at,
      sp.updated_at,
      p.name AS product_name,
      s.store_name
    FROM store_product sp
    JOIN products p ON sp.product_id = p.id
    JOIN stores s ON sp.store_id = s.id;
  `, [storeId]);

  return results;
};
