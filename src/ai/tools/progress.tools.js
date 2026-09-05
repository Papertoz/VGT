const { tool } = require("@langchain/core/tools");
const { getWeeklyProgressSummarySchema } = require("../schemas/progress.tools.schema");
const progressAnalyzerService = require("../../services/progressAnalyzer.service");

const createProgressTools = (userId) => {
    
    const getWeeklyProgressSummaryTool = tool(
        async () => {
            try {
                const result = await progressAnalyzerService.getWeeklyProgressSummary(userId);
                return JSON.stringify(result);
            } catch (error) {
                return `Error: ${error.message}`;
            }
        },
        {
            name: "getWeeklyProgressSummary",
            description: "Retrieves a summary of the user's workout consistency, skipped exercises, and weight changes for the past week. Call this to understand how the user has been progressing.",
            schema: getWeeklyProgressSummarySchema
        }
    );

    return [
        getWeeklyProgressSummaryTool
    ];
};

module.exports = {
    createProgressTools
};
