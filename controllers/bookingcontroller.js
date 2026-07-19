const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");

const createBooking = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      hotelId,
      roomId,
      roomNumber,
      startDate,
      endDate,
      totalAmount,
    } = req.body;

    // Generate booking dates
    const bookingDates = [];

    let current = new Date(startDate);
    const last = new Date(endDate);

    while (current <= last) {
      bookingDates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    // Check every selected room
    for (const id of roomId) {

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

      // Conflict check
      const alreadyBooked = bookingDates.some((date) =>
        selectedRoom.unavailableDates.some(
          (bookedDate) =>
            bookedDate.getTime() === date.getTime()
        )
      );

      if (alreadyBooked) {
        throw new Error("Room already booked for selected dates");
      }

      // Reserve dates
      selectedRoom.unavailableDates.push(...bookingDates);

      await room.save({ session });
    }

    // Create booking
    const booking = await Booking.create(
      [
        {
          userId: req.user.id,
          hotelId,
          roomId,
          roomNumber,
          startDate,
          endDate,
          totalAmount,
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
      err.message === "Room already booked for selected dates"
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