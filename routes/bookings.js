const express = require("express");
const Booking = require("../models/Booking");
const { verifyToken } = require("../utils/verifyToken");
const router = express.Router();


router.post("/", verifyToken, async (req, res, next) => {
  try {
    const { hotelId, roomId, roomNumber, startDate, endDate, totalAmount } = req.body;

    const newBooking = new Booking({
      userId: req.user.id,
      hotelId,
      roomId,
      roomNumber,
      startDate,
      endDate,
      totalAmount,
      isPaid: false
    });

    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
