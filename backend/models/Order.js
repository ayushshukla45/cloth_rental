const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        productId: {
            type: Number,
            required: true,
        },
        name: String,
        image: String,
        quantity: {
            type: Number,
            default: 1
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        pricePerDay: Number,
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    },
    orderStatus: {
        type: String,
        enum: ["Booked", "Out for Delivery", "Rented", "Returned", "Cancelled"],
        default: "Booked",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Order", OrderSchema);
