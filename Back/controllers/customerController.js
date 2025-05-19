import {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
} from '../models/customerModel.js';
import apm from 'elastic-apm-node';

// Get all customers
export const fetchAllCustomers = async (req, res) => {
    try {
        const customers = await getAllCustomers();
        res.status(200).json(customers);
    } catch (error) {
        apm.captureError(error);
        console.error("Get all customers Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to retrieve customers' });
    }
};

// Get customer by ID
export const fetchCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const customer = await getCustomerById(id);
        if (!customer) {
            apm.captureError(new Error('Customer not found'));
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        apm.captureError(error);
        console.error("Get customer by ID:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to retrieve customer' });
    }
};

// Create a new customer
export const createNewCustomer = async (req, res) => {
    const customerData = req.body;
    try {
        const customerId = await createCustomer(customerData);
        res.status(201).json({ message: 'Customer created', customerId });
    } catch (error) {
        apm.captureError(error);
        console.error("create customer Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to create customer' });
    }
};

// Update an existing customer
export const updateExistingCustomer = async (req, res) => {
    const { id } = req.params;
    const customerData = req.body;
    try {
        const affectedRows = await updateCustomer(id, customerData);
        if (affectedRows === 0) {
            apm.captureError(new Error('Customer not found'));
            return res.status(404).json({ error: 'Customer not found' })
        }
        res.status(200).json({ message: 'Customer updated' });
    } catch (error) {
        apm.captureError(error);
        console.error("update customer Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to update customer' });
    }
};

// Delete a customer
export const deleteExistingCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        const affectedRows = await deleteCustomer(id);
        if (affectedRows === 0) {
            apm.captureError(new Error('Customer not found'));
            return res.status(404).json({ error: 'Customer not found' })
        }
        res.status(200).json({ message: 'Customer deleted' });
    } catch (error) {
        apm.captureError(error);
        console.error("delete customer Error:", error); // Log the error for debugging purposes
        return res.status(500).json({ error: 'Failed to delete customer' });
    }
};
