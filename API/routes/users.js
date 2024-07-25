const express = require('express');
const router = express.Router();
const { updateUser, deleteUser, getUser, getUsers } = require('../controllers/usercontroller');
const {verifyToken, verifyUser, verifyAdmin} = require('../utils/verifyToken'); 

// Middleware to verify authentication
router.get("/checkauthentication", verifyToken, (req, res, next) => {
    res.send("hey there, you are successfully logged in ");
});

//after verifyUser, user may delete his acc
router.get("/checkuser/:id", verifyUser, (req, res, next) => {
    res.send("hey there, you are verified and now can dlt your acc ");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
    res.send("hey there, you are verified and now can dlt your acc ");
});

// UPDATE
router.put("/:id",verifyUser ,updateUser);

// DELETE
router.delete("/:id", verifyUser, deleteUser);

// GET
router.get("/:id",verifyUser , getUser);

// GET ALL THE USERS
router.get("/",verifyAdmin , getUsers);

module.exports = router;


//Token Generation: server generates token after successful authentication of the user and authentication is only done after login.
//Cookie Generation: The server sends the JWT back to the client as an HTTP-only cookie in the response. 
//Subsequent Requests: The cookie is included in subsequent requests and the server verifies the token in the cookie to authenticate the user.