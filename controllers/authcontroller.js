const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const { createError } = require("../utils/error.js");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return next(
        new createError(
          400,
          "Username, email and password are required."
        )
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hash,
    });

    await newUser.save();

    res.status(200).send("User has been created.");
  } catch (err) {

    // Duplicate username/email
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];

      return next(
        new createError(
          409,
          `${duplicateField} already exists.`
        )
      );
    }

    next(err);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return next(
        new createError(
          400,
          "Email and password are required."
        )
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new createError(404, "User not found!")
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(
        new createError(
          400,
          "Wrong email or password!"
        )
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT
    );

    const {
      password: userPassword,
      isAdmin,
      username,
      ...otherDetails
    } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        token,
        username,
        details: { ...otherDetails },
        isAdmin,
      });

  } catch (err) {
    next(err);
  }
};


module.exports = {
  register,
  login,
};