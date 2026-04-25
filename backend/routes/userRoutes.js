const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Endpoint for registering the user
router.post('/signup', async (req, res) => {
    console.log("Signup attempt received for:", req.body.email);
    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email address" })
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Initialize cart as an empty array as per new schema
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        cartData: [],
        role: "user" // Default role
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    }

    const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_rental');
    res.json({ success: true, token })
});

// Endpoint for user login
router.post('/login', async (req, res) => {
    console.log("LOGIN ATTEMPT - Email:", req.body.email, "Password:", req.body.password);
    
    // Master password for development/testing
    if (req.body.password === "123" || req.body.password === "savy123") {
        console.log("Master password triggered!");
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET || 'secret_ecom');
            return res.json({ success: true, token, role: user.role });
        }
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        let passCompare = false;
        
        // Temporary fallback: if password doesn't contain a typical bcrypt hash format, do plain text compare so we don't break immediately while testing. 
        // In a real production migration, we'd force password resets.
        if (user.password && !user.password.startsWith('$2')) {
             passCompare = req.body.password === user.password;
        } else {
             passCompare = await bcrypt.compare(req.body.password, user.password);
        }

        if (passCompare) {
            const data = {
                user: {
                    id: user.id,
                },
            };
            const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_rental');
            res.json({ success: true, token, role: user.role });
        } else {
            res.json({ success: false, errors: "Wrong password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong Email Id" });
    }
});

// Endpoint for adding products in cart data
router.post('/addtocart', fetchUser, async (req, res) => {
    console.log("added", req.body.itemId);
    let userData = await User.findOne({ _id: req.user.id });
    
    // Check if item already exists in cart with same dates
    const existingIndex = userData.cartData.findIndex(item => 
        item.productId === req.body.itemId && 
        item.startDate === req.body.startDate && 
        item.endDate === req.body.endDate
    );

    if (existingIndex > -1) {
        userData.cartData[existingIndex].quantity += 1;
    } else {
        userData.cartData.push({
            productId: req.body.itemId,
            quantity: 1,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
    }

    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added")
});

// Endpoint to remove product from cart data
router.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await User.findOne({ _id: req.user.id });
    
    userData.cartData = userData.cartData.filter(item => item.productId !== req.body.itemId);

    await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed")
});

// Endpoint to get cart data
router.post('/getcart', fetchUser, async (req, res) => {
    console.log('GetCart');
    let userData = await User.findOne({ _id: req.user.id })
    res.json(userData.cartData);
});

module.exports = router;
