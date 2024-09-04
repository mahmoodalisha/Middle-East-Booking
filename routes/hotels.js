const express = require('express');
const router = express.Router();
const { createHotel, updateHotel, deleteHotel, getHotel, getHotels, countByCity, countByType, getHotelRooms } = require('../controllers/hotelcontroller');
const { verifyAdmin } = require('../utils/verifyToken');
const Hotel = require("../models/Hotel.js");

// CREATE
router.post("/", createHotel);

// UPDATE
router.put("/:id", updateHotel);

// DELETE
router.delete("/:id", deleteHotel);

// GET
router.get("/find/:id", getHotel);

// GET ALL THE HOTELS
router.get("/", getHotels);
router.get("/countByCity", countByCity);  //for Featured.jsx
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms); //select the number of rooms to reserve of a hotel having its id

module.exports = router;
