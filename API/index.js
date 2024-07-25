const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const { verifyToken, verifyUser, verifyAdmin } = require('./utils/verifyToken');



// Import routes
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const hotelsRoute = require('./routes/hotels');
const roomsRoute = require('./routes/rooms');


dotenv.config();
const app = express();

// Database connection function
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error;
    }
};

// Database connection events
mongoose.connection.on("disconnected", () => {
    console.log("MongoDB got disconnected");
});
mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});

// Middleware
app.use(cookieParser());
app.use(express.json());


// Route Middleware
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});



// Start the server
app.listen(8000, () => {
    connect();
    console.log('Server is running on port 8000');
});
