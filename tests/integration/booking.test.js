const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Hotel = require("../../models/Hotel");
const Room = require("../../models/Room");
const Booking = require("../../models/Booking");
const bcrypt = require("bcryptjs");

describe("Booking API", () => {
  let userToken;
  let userId;
  let hotelId;
  let physicalRoomId; 

  beforeAll(async () => {
    // 1. Setup User
    const userPassword = await bcrypt.hash("booker123", 10);
    const user = await User.create({
      username: "booker",
      email: "booker@test.com",
      password: userPassword,
    });
    userId = user._id.toString();

    const userLogin = await request(app).post("/api/auth/login").send({
      email: "booker@test.com",
      password: "booker123",
    });
    userToken = userLogin.body.token;

    // 2. Setup Hotel
    const hotel = await Hotel.create({
      name: "Booking Test Hotel",
      type: "hotel",
      city: "Kolkata",
      address: "123 Book St",
      distance: "1 km",
      title: "Hotel for Bookings",
      desc: "Testing...",
      cheapestPrice: 100,
    });
    hotelId = hotel._id.toString();

    // 3. Setup Room
    const room = await Room.create({
      title: "Standard Room",
      price: 100,
      maxPeople: 2,
      desc: "A nice room",
      roomNumbers: [{ number: 101, unavailableDates: [] }],
    });
    
    // The controller looks for the _id of the specific physical room inside the array
    physicalRoomId = room.roomNumbers[0]._id.toString();
  });

  describe("POST /api/bookings", () => {
    test("should successfully create a booking for available dates", async () => {
      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          hotelId: hotelId,
          roomId: [physicalRoomId],
          roomNumber: [101],
          startDate: "2026-10-01T00:00:00.000Z",
          endDate: "2026-10-05T00:00:00.000Z",
          totalAmount: 500,
        });

      expect(response.status).toBe(201);
      expect(response.body.totalAmount).toBe(500);

      //Verify dates were injected into the Room's unavailableDates array
      const updatedRoom = await Room.findOne({ "roomNumbers._id": physicalRoomId });
      const bookedDates = updatedRoom.roomNumbers.id(physicalRoomId).unavailableDates;
      expect(bookedDates.length).toBeGreaterThan(0);
    });

    test("should return 409 Conflict when booking overlapping dates", async () => {
      // Trying to book the exact same dates for the exact same room
      const response = await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          hotelId: hotelId,
          roomId: [physicalRoomId],
          roomNumber: [101],
          startDate: "2026-10-02T00:00:00.000Z", 
          endDate: "2026-10-03T00:00:00.000Z",
          totalAmount: 200,
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("Room already booked for selected dates");
    });

    test("should fail without authentication", async () => {
      const response = await request(app)
        .post("/api/bookings")
        .send({
          hotelId: hotelId,
          roomId: [physicalRoomId],
          startDate: "2026-11-01T00:00:00.000Z",
          endDate: "2026-11-05T00:00:00.000Z",
        });

      expect(response.status).toBe(401);
    });
  });
});