const auth = require("../config/firebase.config");
const User = require("../models/user.model");

const firebaseLogin = async (req, res) => {
    try {
        const { idToken, username } = req.body;
        
        if (!idToken) {
            return res.status(400).json({ message: "Firebase ID token is required" });
        }

        // Verify the token with Firebase Admin
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;

        // 1. Check if user already exists by firebaseUid
        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            // 2. Fallback: check if they exist by email (legacy user before Firebase migration)
            user = await User.findOne({ email });
            
            if (user) {
                // Link their legacy account to the new Firebase UID
                user.firebaseUid = uid;
                await user.save();
            } else {
                // 3. Create a brand new user
                user = await User.create({
                    firebaseUid: uid,
                    email: email,
                    username: username || name || email.split("@")[0], // Generate a fallback username
                    fullname: name || "",
                    profilePicture: picture || ""
                });
            }
        }

        // Return user info. Note: We don't need to generate a JWT here because 
        // the frontend will continue to send the Firebase idToken for future requests.
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("Firebase Login Error:", error);
        res.status(401).json({ message: "Invalid or expired Firebase token" });
    }
};

module.exports = {
    firebaseLogin
};