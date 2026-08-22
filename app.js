require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const hotelsRoute = require("./routes/hotels");
const roomsRoute = require("./routes/rooms");
const bookingsRoute = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(
  express.static(path.resolve(__dirname, "frontend-booking", "build"))
);

app.get("/test", (req, res) => {
  res.send("Express app is running");
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);

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

app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(
      __dirname,
      "frontend-booking",
      "build",
      "index.html"
    ),
    (err) => {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

module.exports = app;