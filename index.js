require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");

// Routes
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const hotelsRoute = require("./routes/hotels");
const roomsRoute = require("./routes/rooms");
const bookingsRoute = require("./routes/bookings");

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ✅ Disable caching
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// ✅ Debug ENV (remove later if you want)
console.log("MONGO URL:", process.env.MONGO);

// ✅ Prevent buffering issues
mongoose.set("bufferCommands", false);

// ✅ DB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

// ✅ Static frontend
app.use(
  express.static(path.resolve(__dirname, "frontend-booking", "build"))
);

// ✅ Test route
app.get("/test", (req, res) => {
  res.send("Express app is running");
});

// ✅ API routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);

// ✅ Error handler
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

// ✅ Serve frontend (FIXED PATH)
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "frontend-booking", "build", "index.html"),
    (err) => {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

// ✅ START SERVER ONLY AFTER DB CONNECTS
const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(` Server starting on port ${PORT}...`);
  await connectDB();
});