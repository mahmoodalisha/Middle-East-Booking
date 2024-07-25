const jwt = require('jsonwebtoken');
const { createError } = require('../utils/error');

const verifyToken = (req, res, next) => {
    // Get the token from the request headers, query parameters, or cookies
    const token = req.cookies.access_token

    if (!token) {
        // Token is missing, send an error response
        return next(createError(401, 'sorry dude you are not authenticated'));
    }

    // Verify the token
    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            // Token is invalid, send an error response
            return next(createError(401, 'Invalid token'));
        }
        // Token is valid, store the decoded user information in the request object
        req.user = user;
        // Proceed to the next middleware
        next();
    });
};

// Middleware to verify user
const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return next(createError(403, 'You are not allowed to do that!'));
        }
    });
};

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
