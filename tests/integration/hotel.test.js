const request = require("supertest");
const app = require("../../app");

const User = require("../../models/User");
const Hotel = require("../../models/Hotel");

const bcrypt = require("bcryptjs");

describe("Hotel API", () => {
  let adminToken;
  let userToken;
  let hotelId;

  // Create admin and normal user before the tests
  beforeAll(async () => {
    // ---------- CREATE ADMIN ----------
    const adminPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      username: "hoteladmin",
      email: "hoteladmin@test.com",
      password: adminPassword,
      isAdmin: true,
    });

    // Login admin
    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "hoteladmin@test.com",
        password: "admin123",
      });

    adminToken = adminLogin.body.token;

    // ---------- CREATE NORMAL USER ----------
    const userPassword = await bcrypt.hash("user123", 10);

    await User.create({
      username: "hoteluser",
      email: "hoteluser@test.com",
      password: userPassword,
      isAdmin: false,
    });

    // Login normal user
    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "hoteluser@test.com",
        password: "user123",
      });

    userToken = userLogin.body.token;
  });

  // =========================
  // CREATE HOTEL
  // =========================

  describe("POST /api/hotels", () => {
    test("admin should create a hotel", async () => {
      const response = await request(app)
        .post("/api/hotels")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Grand Hotel",
          type: "hotel",
          city: "Kolkata",
          address: "123 Test Street",
          distance: "2 km from city center",
          photos: ["photo1.jpg"],
          title: "A beautiful test hotel",
          desc: "This hotel is created during integration testing.",
          rating: 8,
          cheapestPrice: 150,
          featured: true,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Test Grand Hotel");

      // Save ID so we can use this hotel in later tests
      hotelId = response.body._id;
    });

    test("normal user should not create a hotel", async () => {
      const response = await request(app)
        .post("/api/hotels")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Unauthorized Hotel",
          type: "hotel",
          city: "Kolkata",
          address: "Unauthorized Street",
          distance: "3 km",
          title: "Unauthorized hotel",
          desc: "This should not be created.",
          cheapestPrice: 100,
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You are not allowed to do that!"
      );
    });

    test("should not create a hotel without authentication", async () => {
      const response = await request(app)
        .post("/api/hotels")
        .send({
          name: "Unauthenticated Hotel",
          type: "hotel",
          city: "Kolkata",
          address: "Some address",
          distance: "2 km",
          title: "Test hotel",
          desc: "This should not be created.",
          cheapestPrice: 100,
        });

      expect(response.status).toBe(401);
    });
  });

  // =========================
  // GET HOTEL
  // =========================

  describe("GET /api/hotels", () => {
    test("should get all hotels", async () => {
      const response = await request(app)
        .get("/api/hotels");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // =========================
  // GET HOTEL BY ID
  // =========================

  describe("GET /api/hotels/find/:id", () => {
    test("should get a hotel by ID", async () => {
      const response = await request(app)
        .get(`/api/hotels/find/${hotelId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(hotelId);
      expect(response.body.name).toBe("Test Grand Hotel");
    });
  });

  // =========================
  // UPDATE HOTEL
  // =========================

  describe("PUT /api/hotels/:id", () => {
    test("admin should update a hotel", async () => {
      const response = await request(app)
        .put(`/api/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Updated Test Hotel",
          cheapestPrice: 200,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Test Hotel");
      expect(response.body.cheapestPrice).toBe(200);
    });

    test("normal user should not update a hotel", async () => {
      const response = await request(app)
        .put(`/api/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          name: "Hacked Hotel",
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You are not allowed to do that!"
      );
    });
  });

  // =========================
  // HOTEL FILTERING
  // =========================

  describe("GET /api/hotels with filters", () => {
    test("should filter hotels by featured", async () => {
      const response = await request(app)
        .get("/api/hotels")
        .query({
          featured: "true",
          limit: 2,
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((hotel) => {
        expect(hotel.featured).toBe(true);
      });
    });

    test("should filter hotels by price range", async () => {
      const response = await request(app)
        .get("/api/hotels")
        .query({
          min: 100,
          max: 300,
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((hotel) => {
        expect(hotel.cheapestPrice).toBeGreaterThanOrEqual(100);
        expect(hotel.cheapestPrice).toBeLessThanOrEqual(300);
      });
    });
  });

  // =========================
  // COUNT BY CITY
  // =========================

  describe("GET /api/hotels/countByCity", () => {
    test("should return hotel count for cities", async () => {
      const response = await request(app)
        .get("/api/hotels/countByCity")
        .query({
          cities: "Kolkata",
        });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });

  // =========================
  // COUNT BY TYPE
  // =========================

  describe("GET /api/hotels/countByType", () => {
    test("should return hotel counts by type", async () => {
      const response = await request(app)
        .get("/api/hotels/countByType");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: "hotel",
          }),
          expect.objectContaining({
            type: "apartments",
          }),
          expect.objectContaining({
            type: "resorts",
          }),
          expect.objectContaining({
            type: "villas",
          }),
          expect.objectContaining({
            type: "cabins",
          }),
        ])
      );
    });
  });

  // =========================
  // DELETE HOTEL
  // =========================

  describe("DELETE /api/hotels/:id", () => {
    test("normal user should not delete a hotel", async () => {
      const response = await request(app)
        .delete(`/api/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe(
        "You are not allowed to do that!"
      );
    });

    test("admin should delete a hotel", async () => {
      const response = await request(app)
        .delete(`/api/hotels/${hotelId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toBe("Hotel deleted");

      // Confirm it was actually deleted
      const deletedHotel = await Hotel.findById(hotelId);

      expect(deletedHotel).toBeNull();
    });
  });
});