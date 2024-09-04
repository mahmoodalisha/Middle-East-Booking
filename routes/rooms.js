const express = require('express');
const router = express.Router();
const { createRoom, updateRoom, updateRoomAvailability, deleteRoom, getRoom, getRooms } = require('../controllers/roomcontroller');
const { verifyAdmin } = require('../utils/verifyToken');

// CREATE
router.post("/:hotelid", createRoom);

// UPDATE
router.put("/:id", updateRoom);
router.put("/availability/:id", updateRoomAvailability);

// DELETE
router.delete("/:id", deleteRoom);

// GET
router.get("/:id", getRoom);

// GET ALL THE RoomS
router.get("/", getRooms);

module.exports = router;