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
//this token or id is stored in client's browser history called session storage, it is also stored in database
//client having the token, should be secured, so we encrypt them and provide a secret key to the server to prevent hacking