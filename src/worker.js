require('dotenv').config();
const connectDB = require("./db/db");
const { setupAiWorker } = require("./ai/workflows/ai.jobs");

const startWorker = async () => {
    try {
        console.log("Starting AI Background Worker...");

        // 1. Connect to MongoDB because the worker needs to fetch user data and workout history
        await connectDB();
        console.log("MongoDB Connected for Worker.");

        // 2. Initialize the BullMQ Worker
        // This will connect to Redis (using REDIS_HOST/PORT from .env or defaulting to 127.0.0.1:6379)
        const worker = setupAiWorker();

        console.log("Worker is now listening for AI analysis jobs on 'ai-analysis-queue'...");

        // Handle graceful shutdown
        process.on("SIGINT", async () => {
            console.log("Shutting down worker...");
            await worker.close();
            process.exit(0);
        });

    } catch (error) {
        console.error("Failed to start worker:", error);
        process.exit(1);
    }
};

startWorker();
