const aiService = require("../services/ai.service");

const chat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        const response = await aiService.generateChatResponse(userId, message);

        res.status(200).json({
            success: true,
            response
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    chat
};
