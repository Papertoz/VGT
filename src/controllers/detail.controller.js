const User = require('../models/user.model');
const imagekit = require('../services/storage.service');
const updateDetails = async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("IMAGEKIT OBJECT:", imagekit);
    try {

        const {
            fullname,
            weight,
            height,
            age,
            gender,
            level
        } = req.body;

        let profilePicture;

        if (req.file) {
            try {
                console.log("Uploading file to ImageKit...");

                const uploadResponse = await imagekit.files.upload({
                    file: req.file.buffer.toString("base64"),
                    fileName: `profile_${Date.now()}.jpg`,
                });

                console.log("Upload successful");
                console.log(uploadResponse);

                profilePicture = uploadResponse.url;

            } catch (err) {
                console.error("ImageKit Error:", err);
                throw err;
            }
        }

        const updateData = {
            isprofilecomplete: true
        };

        if (fullname !== undefined) updateData.fullname = fullname;
        if (profilePicture !== undefined) updateData.profilePicture = profilePicture;
        if (weight !== undefined) updateData.weight = weight;
        if (height !== undefined) updateData.height = height;
        if (age !== undefined) updateData.age = age;
        if (gender !== undefined) updateData.gender = gender;
        if (level !== undefined) updateData.level = level;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = {
    updateDetails,
    getDetails
};