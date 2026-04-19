const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(process.env.MONGODB_URI);


// API Creation
app.get("/", (req, res) => {
    res.send("Express App is running")
});

// Image storage endpoint
app.use('/images', express.static('upload/images'));

// Import Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Use Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);

// Image Upload Endpoint (kept in index for simplicity or moved to a utility)
const multer = require("multer");
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single('product'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: 0, error: "No file uploaded" });
    }
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port)
    } else {
        console.log("Error: " + error)
    }
});
