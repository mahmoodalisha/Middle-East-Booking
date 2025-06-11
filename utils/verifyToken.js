const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(new createError(401, 'Sorry dude, you are not authenticated'));
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) return next(new createError(401, 'Invalid token'));
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
