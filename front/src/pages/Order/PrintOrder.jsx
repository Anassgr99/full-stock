import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import logo from "../../assets/logo.png"; // Import logo
import { FiPrinter, FiUser, FiMail, FiPhone, FiMapPin, FiDollarSign, FiShoppingCart } from "react-icons/fi";
import { jsPDF } from "jspdf";
import { ThemeContext } from "../../context/ThemeContext";

const PrintOrder = () => {
  const { theme } = useContext(ThemeContext); // Access the current theme
  const { orderId } = useParams();
  const [order, setOrder] = useState({ products: [] });
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch order data
        const orderResponse = await axios.get(
          `http://localhost:3000/api/Orders/${orderId}`
        );
        const orderData = orderResponse.data;
        setOrder(orderData);

        // Fetch customer data based on customer_id from the order
        if (orderData.customer_id) {
          const customerResponse = await axios.get(
            `http://localhost:3000/api/customers/${orderData.customer_id}`
          );
          setCustomer(customerResponse.data);
        }

        setLoading(false);
      } catch (err) {
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, [orderId]);

  // Generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");

    // Add Logo
    const logoWidth = 50;
    const logoHeight = 20;
    doc.addImage(logo, "PNG", 10, 10, logoWidth, logoHeight);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Black color for text
    doc.text("Invoice", 105, 40, null, null, "center");

    // Line below title
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45);

    // Customer Details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Customer Details", 10, 55);
    doc.setFontSize(10);
    doc.text(`Name: ${customer?.name || "N/A"}`, 10, 65);
    doc.text(`Email: ${customer?.email || "N/A"}`, 10, 75);
    doc.text(`Phone: ${customer?.phone || "N/A"}`, 10, 85);
    doc.text(`Address: ${customer?.address || "N/A"}`, 10, 95);

    // Order Details Section
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Order Details", 10, 110);
    doc.setFontSize(10);
    doc.text(`Order ID: ${order?.id || "N/A"}`, 10, 120);
    doc.text(`Order Date: ${order?.order_date || "N/A"}`, 10, 130);
    doc.text(`Payment Type: ${order?.payment_type || "N/A"}`, 10, 150);
    doc.text(`Subtotal: $${order?.sub_total || "0.00"}`, 10, 160);
    doc.text(`Total Amount: $${order?.total || "0.00"}`, 10, 170);

    // Line separating order details
    doc.line(10, 175, 200, 175);

    // Products Table
    doc.setFontSize(12);
    doc.text("Products", 10, 185);
    doc.setFontSize(10);

    // Table Header
    const headerY = 190;
    doc.setTextColor(255, 255, 255); // White for header
    doc.setFillColor(0, 0, 0); // Black background for table header
    doc.rect(10, headerY - 5, 20, 8, "F"); // No column header for 'No.'
    doc.rect(30, headerY - 5, 80, 8, "F"); // Product Name
    doc.rect(110, headerY - 5, 30, 8, "F"); // Quantity
    doc.rect(140, headerY - 5, 30, 8, "F"); // Price
    doc.rect(170, headerY - 5, 30, 8, "F"); // Total

    doc.setTextColor(255, 255, 255); // White text color for header
    doc.text("No.", 15, headerY);
    doc.text("Product Name", 40, headerY);
    doc.text("Quantity", 120, headerY, null, null, "right");
    doc.text("Price", 150, headerY, null, null, "right");
    doc.text("Total", 180, headerY, null, null, "right");

    // Table Rows
    let y = headerY + 10;
    order.products.forEach((product, index) => {
      const price = product.price ? parseFloat(product.price) : 0;
      const quantity = product.quantity ? parseInt(product.quantity) : 0;
      const total = (quantity * price).toFixed(2);

      doc.setTextColor(0, 0, 0); // Reset to black text for content
      doc.text(`${index + 1}`, 15, y);
      doc.text(`${product.name || "N/A"}`, 40, y);
      doc.text(`${quantity}`, 120, y, null, null, "right");
      doc.text(`$${price.toFixed(2)}`, 150, y, null, null, "right");
      doc.text(`$${total}`, 180, y, null, null, "right");
      y += 10;
    });

    // Footer with thank you message
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Thank you for your business!", 105, 280, null, null, "center");

    // Save the PDF
    doc.save("invoice.pdf");
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className={`p-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'} w-full`}>
    {/* Grid layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Customer Details */}
      <div className={` p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiUser /> Customer Details
        </h2>
        {customer ? (
          <>
            <p className="flex items-center gap-2">
              <FiUser className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} /> <strong>Nom:</strong> {customer.name || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <FiPhone className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} /> <strong>Téléphone:</strong> {customer.phone || "N/A"}
            </p>
            <p className="flex items-center gap-2">
              <FiMapPin className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} /> <strong>Address:</strong> {customer.address || "N/A"}
            </p>
          </>
        ) : (
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Aucune information client disponible.</p>
        )}
      </div>
  
      {/* Payment and Order Details */}
      <div className={` p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiDollarSign /> Détails du paiement et de la commande
        </h2>
        <p>
          <strong>Order ID:</strong> {order.id || "N/A"}
        </p>
        <p>
          <strong>Order Date:</strong> {order.order_date || "N/A"}
        </p>
        <p>
          <strong>Type de paiement:</strong> {order.payment_type || "N/A"}
        </p>
        <p>
          <strong>Subtotal:</strong> ${order.sub_total || "0.00"}
        </p>
        <p>
          <strong>Total Amount:</strong> ${order.total || "0.00"}
        </p>
      </div>
    </div>
  
    {/* Products Table */}
    <div className={` p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <FiShoppingCart /> Products
      </h2>
      <table className={`table-auto w-full text-left border-collapse border border-gray-200 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        <thead className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}>
        <tr className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black'}`}>
  <th className="border border-gray-200 px-4 py-2">No.</th>
  <th className="border border-gray-200 px-4 py-2">Product Name</th>
  <th className="border border-gray-200 px-4 py-2">Quantity</th>
  <th className="border border-gray-200 px-4 py-2">Price</th>
  <th className="border border-gray-200 px-4 py-2">Total</th>
</tr>

        </thead>
        <tbody>
          {order.products && order.products.length > 0 ? (
            order.products.map((product, index) => (
              <tr key={index} className={`hover:bg-${theme === 'dark' ? 'gray-600' : 'gray-50'}`}>
                <td className="border border-gray-200 px-4 py-2 text-center">{index + 1}</td>
                <td className="border border-gray-200 px-4 py-2">{product.productname || "N/A"}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">{product.quantity || "0"}</td>
                <td className="border border-gray-200 px-4 py-2 text-right">${product.price || "0.00"}</td>
                <td className="border border-gray-200 px-4 py-2 text-right">${(product.quantity * product.price).toFixed(2) || "0.00"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No products available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  
    {/* Print Button */}
    <div className="mt-6 flex justify-end">
      <button
        onClick={generatePDF}
        className={`px-6 py-3 ${theme === 'dark' ? 'bg-orange-600' : 'bg-orange-500'} text-white rounded-lg hover:bg-orange-600 flex items-center gap-2`}
      >
        <FiPrinter /> Print Invoice
      </button>
    </div>
  </div>
  
  );
};

export default PrintOrder;
