const express=require("express");

const router=express.Router();

const {
    createBooking
}=require("../controllers/bookingcontroller");

const {
    verifyToken
}=require("../utils/verifyToken");


router.post(
    "/",
    verifyToken,
    createBooking
);


module.exports=router;