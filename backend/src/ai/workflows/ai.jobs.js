const { Queue, Worker } = require("bullmq");
const aiService = require("../../services/ai.service");
const User = require("../../models/user.model");

const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1", 
    port: process.env.REDIS_PORT || 6379,
};

const aiQueue = new Queue("ai-analysis-queue", { connection });

const setupAiWorker = () => {
    const worker = new Worker("ai-analysis-queue", async (job) => {
        if (job.name === "analyze-weekly-progress") {
            const { userId } = job.data;
            console.log(`[Worker] Starting weekly progress analysis for user: ${userId}`);
            
            try {
                // Call the AI Service with a specific system prompt indicating a background run
                // For simplicity, we just use the chat function but pass a specific query
                const backgroundQuery = "Please review my past week's workouts. If you notice a consistent pattern of skipping a specific exercise, or lack of time, please adapt today's workout accordingly.";
                
                const response = await aiService.generateChatResponse(userId, backgroundQuery);
                
                console.log(`[Worker] AI Response for ${userId}: ${response}`);
                return { success: true, response };

            } catch (error) {
                console.error(`[Worker] Failed for ${userId}:`, error.message);
                throw error;
            }
        }
    }, { connection });

    worker.on("completed", (job) => {
        console.log(`[Worker] Job ${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
        console.log(`[Worker] Job ${job.id} has failed with ${err.message}`);
    });

    return worker;
};

// This function could be called by a cron-scheduler (like node-cron) daily at 2 AM
const scheduleWeeklyAnalysisForAllUsers = async () => {
    const users = await User.find({ }); // Ideally filter for users with active plans
    for (const user of users) {
        await aiQueue.add("analyze-weekly-progress", { userId: user._id });
    }
    console.log(`[Queue] Added progress analysis jobs for ${users.length} users.`);
};

module.exports = {
    aiQueue,
    setupAiWorker,
    scheduleWeeklyAnalysisForAllUsers
};
