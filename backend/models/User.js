const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Array,
        default: [], // Updated to store array of objects {productId, startDate, endDate, quantity}
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", UserSchema);
