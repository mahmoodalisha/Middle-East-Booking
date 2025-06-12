require("dotenv").config()
const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const { verifyToken, verifyUser, verifyAdmin } = require('./utils/verifyToken');
const db = process.env.MONGO;
const path = require("path")


const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const hotelsRoute = require('./routes/hotels');
const roomsRoute = require('./routes/rooms');
const bookingsRoute = require('./routes/bookings');


const app = express();
const cors = require("cors");

app.use(cors());

// Add Cache-Control middleware
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});
const mongoose = require("mongoose");

mongoose.connect(db)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
    });

//telling backend to look for frontend here in this folder
app.use(express.static(path.resolve(__dirname, 'frontend-booking', 'build')))

app.get("/test",(req,res)=>{
    res.send("Express app is running")
})


app.use(cookieParser());
app.use(express.json());



app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);

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

//serving frontend routes first
app.get('*', (req, res) => {
    res.sendFile(
        path.resolve(__dirname, 'frontend', 'build', 'index.html'),
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        }
    )
});



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
