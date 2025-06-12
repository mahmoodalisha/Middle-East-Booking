const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "You are not authenticated"));
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));
    console.log("Decoded JWT user object:", user);
    req.user = user;
    next();
  });
};


const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(new createError(403, 'You are not allowed to do that!'));
        }
    });
};

module.exports = { verifyToken, verifyUser };


const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, 'You are not allowed to do that!'));
        }
    });
};

module.exports = { verifyToken, verifyUser, verifyAdmin };
