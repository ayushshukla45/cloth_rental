const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const fetchUser = require('../middleware/auth');

// API for creating an order (Booking)
router.post('/placeorder', fetchUser, async (req, res) => {
    try {
        const { products, totalAmount } = req.body;
        
        const order = new Order({
            userId: req.user.id,
            products: products,
            totalAmount: totalAmount,
            paymentStatus: "Pending",
            orderStatus: "Booked"
        });

        await order.save();

        // Clear user cart after placing order
        await User.findByIdAndUpdate(req.user.id, { cartData: [] });

        res.json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
});

// API for getting user orders
router.get('/myorders', fetchUser, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching orders" });
    }
});

// API for admin to get all orders
router.get('/allorders', async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching all orders" });
    }
});

// API for admin to update order status
router.post('/updateorderstatus', async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { orderStatus: status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating status" });
    }
});

module.exports = router;
