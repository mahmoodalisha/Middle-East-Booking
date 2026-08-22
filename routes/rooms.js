const express = require('express');
const router = express.Router();
const { createRoom, updateRoom, deleteRoom, getRoom, getRooms } = require('../controllers/roomcontroller');
const { verifyAdmin } = require('../utils/verifyToken');

// CREATE
router.post("/:hotelid",verifyAdmin, createRoom);

// UPDATE
router.put("/:id",verifyAdmin, updateRoom);

// DELETE
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);

// GET
router.get("/:id", getRoom);

// GET ALL THE RoomS
router.get("/", getRooms);

module.exports = router;

