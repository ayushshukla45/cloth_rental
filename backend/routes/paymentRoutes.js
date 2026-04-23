const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const fetchUser = require('../middleware/auth');
const crypto = require('crypto');

// Generate a unique transaction ID
function generateTransactionId() {
    return 'TXN_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Create a payment for an order
router.post('/createpayment', fetchUser, async (req, res) => {
    try {
        const { orderId, amount, method } = req.body;

        // Check if order exists and belongs to this user
        const order = await Order.findOne({ _id: orderId, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Check if payment already exists for this order
        const existingPayment = await Payment.findOne({ orderId: orderId });
        if (existingPayment) {
            return res.status(400).json({ success: false, message: "Payment already exists for this order" });
        }

        const transactionId = generateTransactionId();

        const payment = new Payment({
            transactionId: transactionId,
            orderId: orderId,
            userId: req.user.id,
            amount: amount,
            method: method,
            status: "Completed",  // Mock payment - auto complete
        });

        await payment.save();

        // Update order payment status to Paid
        await Order.findByIdAndUpdate(orderId, { paymentStatus: "Paid" });

        res.json({
            success: true,
            message: "Payment successful",
            transactionId: transactionId,
            paymentId: payment._id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Payment processing error" });
    }
});

// Get payment details for an order
router.get('/orderpayment/:orderId', fetchUser, async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        if (!payment) {
            return res.status(404).json({ success: false, message: "No payment found for this order" });
        }
        res.json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching payment" });
    }
});

// Get all payments for current user
router.get('/mypayments', fetchUser, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user.id })
            .populate('orderId')
            .sort({ date: -1 });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching payments" });
    }
});

// Admin: Get all payments
router.get('/allpayments', async (req, res) => {
    try {
        const payments = await Payment.find({})
            .populate('orderId')
            .populate('userId', 'name email')
            .sort({ date: -1 });
        res.json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching all payments" });
    }
});

module.exports = router;
