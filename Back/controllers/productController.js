import { getAllProducts, getProductById, createProduct, updateProduct,getStockQuantities,getStockQuantitiesById, deleteProduct, getUnit,getProductsByCategoryId } from '../models/productModel.js';
import apm from 'elastic-apm-node';
// Get all products
export const fetchAllProducts = async (req, res) => {

    if (!req.user) {
        apm.captureError(new Error('Unauthorized access'));
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        apm.captureError(error);
        console.error("Get all products Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: "Failed to retrieve products" });
    }
};


// Get product by ID
export const fetchProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await getProductById(id);
        if (!product) {
            apm.captureError(new Error('Product not found'));
            return res.status(404).json({ error: 'Product not found' })
        }
        res.status(200).json(product);
    } catch (error) {
        apm.captureError(error);
        console.error("Get product by ID Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to retrieve product' });
    }
};

// Create a new product
export const createNewProduct = async (req, res) => {
    const productData = req.body;
    try {
        const productId = await createProduct(productData);
        res.status(201).json({ message: 'Product created', productId });
    } catch (error) {
        apm.captureError(error);
        console.error("create product Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to create product' });
    }
};

// Update an existing product
export const updateExistingProduct = async (req, res) => {
    const { id } = req.params;
    const productData = req.body;
    try {
        const affectedRows = await updateProduct(id, productData);
        if (affectedRows === 0) {
            apm.captureError(new Error('Product not found'));
            return res.status(404).json({ error: 'Product not found' })
        }
        res.status(200).json({ message: 'Product updated' });
    } catch (error) {
        apm.captureError(error);
        console.error("update product Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to update product' });
    }
};

// Delete a product
export const deleteExistingProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await deleteProduct(id);
        if (affectedRows === 0) {
            apm.captureError(new Error('Product not found'));
            return res.status(404).json({ error: 'Product not found' })
        }
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        apm.captureError(error);
        console.error("delete product Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to delete product' });
    }
};

// Import the required service function

// Define the controller function
export const getUnitController = async (req, res) => {
    try {
        // Extract the `id` from the request parameters
        const { id } = req.params;

        // Validate the input
        if (!id) {
            apm.captureError(new Error('Unit ID is required.'));
            return res.status(400).json({ error: 'Unit ID is required.' });
        }

        // Fetch unit details using the service function
        const unit = await getUnit(id);

        // Check if the unit exists
        if (!unit || unit.length === 0) {
            apm.captureError(new Error('Unit not found.'));
            return res.status(404).json({ message: 'Unit not found.' });
        }

        // Return the unit data
        return res.status(200).json(unit);
    } catch (error) {
        apm.captureError(error);
        console.error(" getUnitController / Internal Server Error.:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
};


export const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const products = await getProductsByCategoryId(categoryId);

        if (!products || products.length === 0) {
            apm.captureError(new Error('No products found for this category.'));
            return res.status(404).json({ message: 'No products found for this category.' });
        }

        res.status(200).json(products);
    } catch (error) {
        apm.captureError(error);
        console.error("Error retrieving products by category:", error); // Log the error for debugging purposes
        return res.status(500).json({ message: 'Error retrieving products by category.' });
    }
};


// Controller to handle fetching stock quantities
export const fetchStockQuantities = async (req, res) => {
    try {
        const stockQuantities = await getStockQuantities();

        // Send the formatted stock quantities as a response
        res.status(200).json(stockQuantities);
    } catch (error) {
        //console.error("Error fetching stock quantities:", error.message);
        apm.captureError(error);
        console.error("Error fetching stock quantities:", error); // Log the error for debugging purposes
        return res.status(500).json({
            message: "Error fetching stock quantities",
            error: error.message,
        });
    }
};
export const fetchStockQuantitiesByid = async (req, res) => {
    try {
        // Extract store ID from route parameters
        const storeId = req.params.id;
        

        // Call the database function with the storeId
        const stockQuantities = await getStockQuantitiesById(storeId);

        // Send the formatted stock quantities as a response
        res.status(200).json(stockQuantities);
    } catch (error) {
        //console.error("Error fetching stock quantities:", error.message);
        apm.captureError(error);
        console.error("Error fetching stock quantities:", error); // Log the error for debugging purposes
        return res.status(500).json({
            message: "Error fetching stock quantities",
            error: error.message,
        });
    }
};

