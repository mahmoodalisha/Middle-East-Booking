const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      hotelId,
      roomId, // Array of subdocument IDs (_id of each specific roomNumber)
      roomNumber,
      startDate,
      endDate,
    } = req.body;

    // 1. Validate dates and calculate number of nights
    const start = new Date(startDate);
    const last = new Date(endDate);

    const numNights = Math.round((last - start) / (1000 * 60 * 60 * 24));

    if (numNights <= 0) {
      throw new Error("Invalid date range selected.");
    }

    // Generate booking dates array for availability checks
    const bookingDates = [];
    let current = new Date(start);

    while (current <= last) {
      bookingDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    let calculatedTotalAmount = 0;

    // 2. Iterate through each room ID selected by the user
    for (const id of roomId) {
      // Find the parent Room category that contains this specific roomNumber subdocument
      const room = await Room.findOne(
        {
          "roomNumbers._id": id,
        },
        null,
        { session }
      );

      if (!room) {
        throw new Error("Room not found");
      }

      const selectedRoom = room.roomNumbers.id(id);

      if (!selectedRoom) {
        throw new Error("Room not found");
      }

      // 3. Conflict check for double bookings
      const alreadyBooked = bookingDates.some((date) =>
        selectedRoom.unavailableDates.some(
          (bookedDate) => bookedDate.getTime() === date.getTime()
        )
      );

      if (alreadyBooked) {
        throw new Error("Room already booked for selected dates");
      }

      // 4. SECURE SERVER-SIDE PRICING CALCULATION
      // room.price comes directly from the database schema, preventing tampering
      calculatedTotalAmount += room.price * numNights;

      // 5. Reserve dates in the subdocument
      selectedRoom.unavailableDates.push(...bookingDates);

      await room.save({ session });
    }

    // 6. Create the booking entry with the secure price
    const booking = await Booking.create(
      [
        {
          userId: req.user.id,
          hotelId,
          roomId,
          roomNumber,
          startDate,
          endDate,
          totalAmount: calculatedTotalAmount, // Securely calculated on the server
          isPaid: false,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json(booking[0]);
  } catch (err) {
    await session.abortTransaction();

    if (
      err.message === "Room already booked for selected dates" ||
      err.message === "Invalid date range selected."
    ) {
      return res.status(409).json({
        message: err.message,
      });
    }

    next(err);
  } finally {
    session.endSession();
  }
};

module.exports = {
  createBooking,
};