import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from '../models/orderModel.js';
import apm from 'elastic-apm-node';
// Get all orders
export const fetchAllOrders = async (req, res) => {
    try {
        const orders = await getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        apm.captureError(error);
        console.error("Get all orders Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

// Get order by ID
export const fetchOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await getOrderById(id);
        if (!order) {
            apm.captureError(new Error('Order not found'));
            return res.status(404).json({ error: 'Order not found' })
        }
        res.status(200).json(order);
    } catch (error) {
        apm.captureError(error);
        console.error("Get order by ID Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to retrieve order' });
    }
};

// Create a new order
export const createNewOrder = async (req, res) => {
    const orderData = req.body;
    try {
        const orderId = await createOrder(orderData);
        res.status(201).json({ message: 'Order created', orderId });
    } catch (error) {
        apm.captureError(error);
        console.error("create order Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to create order' });
    }
};

// Update an existing order
export const updateExistingOrder = async (req, res) => {
    const { id } = req.params;
    const orderData = req.body;
    try {
        const affectedRows = await updateOrder(id, orderData);

        if (affectedRows === 0) {
            apm.captureError(new Error('Order not found'));
            return res.status(404).json({ error: 'Order not found' });
        }

        res.status(200).json({ message: 'Order updated' });
    } catch (error) {
        apm.captureError(error);
        console.error("update order Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to update order' });
    }
};


// Delete an order
export const deleteExistingOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await deleteOrder(id);
        if (affectedRows === 0) {
            apm.captureError(new Error('Order not found'));
            return res.status(404).json({ error: 'Order not found' })
        }
        res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
        apm.captureError(error);
        console.error("delete order Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to delete order' });
    }
};
