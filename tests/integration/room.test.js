const request = require("supertest");
const app = require("../../app");
const User = require("../../models/User");
const Hotel = require("../../models/Hotel");
const Room = require("../../models/Room");
const bcrypt = require("bcryptjs");

describe("Room API", () => {
  let adminToken;
  let userToken;
  let hotelId;
  let roomId;

  beforeAll(async () => {
    //Setup Admin
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "roomadmin",
      email: "roomadmin@test.com",
      password: adminPassword,
      isAdmin: true,
    });
    const adminLogin = await request(app).post("/api/auth/login").send({
      email: "roomadmin@test.com",
      password: "admin123",
    });
    adminToken = adminLogin.body.token;

    // Setup Normal User
    const userPassword = await bcrypt.hash("user123", 10);
    await User.create({
      username: "roomuser",
      email: "roomuser@test.com",
      password: userPassword,
      isAdmin: false,
    });
    const userLogin = await request(app).post("/api/auth/login").send({
      email: "roomuser@test.com",
      password: "user123",
    });
    userToken = userLogin.body.token;

    // Create a Hotel to attach our Rooms to
    const hotel = await Hotel.create({
      name: "Room Test Hotel",
      type: "hotel",
      city: "Kolkata",
      address: "123 Room St",
      distance: "1 km",
      title: "Hotel for Room Tests",
      desc: "Testing...",
      cheapestPrice: 100,
    });
    hotelId = hotel._id.toString();
  });

  describe("POST /api/rooms/:hotelid", () => {
    test("admin should create a room and link it to the hotel", async () => {
      const response = await request(app)
        .post(`/api/rooms/${hotelId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Deluxe Suite",
          price: 250,
          maxPeople: 3,
          desc: "A beautiful suite with a city view.",
          roomNumbers: [{ number: 101 }, { number: 102 }],
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Deluxe Suite");
      roomId = response.body._id;

      //Verify the room was actually pushed to the Hotel's array
      const updatedHotel = await Hotel.findById(hotelId);
      const roomIds = updatedHotel.rooms.map(room => room.toString());
      expect(roomIds).toContain(response.body._id);
    });

    test("normal user should not create a room", async () => {
      const response = await request(app)
        .post(`/api/rooms/${hotelId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Standard Room",
          price: 100,
          maxPeople: 2,
          desc: "Basic room",
        });

      expect(response.status).toBe(403);
    });
  });

  describe("GET /api/rooms", () => {
    test("should get all rooms", async () => {
      const response = await request(app).get("/api/rooms");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("PUT /api/rooms/:id", () => {
    test("admin should update a room", async () => {
      const response = await request(app)
        .put(`/api/rooms/${roomId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ price: 300 });

      expect(response.status).toBe(200);
      expect(response.body.price).toBe(300);
    });
  });

  describe("DELETE /api/rooms/:id/:hotelid", () => {
    test("admin should delete a room and remove it from the hotel", async () => {
      const response = await request(app)
        .delete(`/api/rooms/${roomId}/${hotelId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      // Check: Verify it's gone from the Room collection
      const deletedRoom = await Room.findById(roomId);
      expect(deletedRoom).toBeNull();

      // Check: Verify it was pulled from the Hotel's array
      const updatedHotel = await Hotel.findById(hotelId);
      expect(updatedHotel.rooms).not.toContain(roomId);
    });
  });
});