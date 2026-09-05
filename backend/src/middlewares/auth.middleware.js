const auth = require("../config/firebase.config");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            });
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        // Verify Firebase Token
        const decodedToken = await auth.verifyIdToken(token);
        
        // Find user in our database by firebaseUid
        const user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (!user) {
            // Edge case: token is valid, but user hasn't completed signup flow in backend
            return res.status(401).json({
                message: "User not found in database. Please login to complete registration."
            });
        }

        // Attach user info to request
        req.user = { id: user._id, firebaseUid: decodedToken.uid, email: decodedToken.email };
        next();

    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = { authMiddleware };