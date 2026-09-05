const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage } = require("@langchain/core/messages");
const { z } = require("zod");

const createSupervisorNode = () => {
    return async (state) => {
        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-3.6-flash",
            temperature: 0,
            apiKey: process.env.GEMINI_API_KEY
        });

        const systemPrompt = `You are a Supervisor AI routing user requests to specialized agents.
Available Agents:
- Safety: For evaluating injury risks, overtraining, and medical red flags.
- Workout: For questions about exercises, workout plans, adapting workouts.
- Nutrition: For questions about diet, macros, calories, meal plans, and budget.
- Recovery: For rest days, stretching routines, sleep advice, and fatigue monitoring.
- Progress: For analyzing workout logs, visual trends, and weekly/monthly summaries.
- Goal: For setting realistic SMART goals, tracking milestones.
- Habit: For promoting daily healthy habits (water, sleep, mobility).
- None: If the user is just saying hello or asking something irrelevant to fitness.

Analyze the conversation and decide the most appropriate next agent to handle the user's request.
`;

        const schema = z.object({
            next: z.enum(["Safety", "Workout", "Nutrition", "Recovery", "Progress", "Goal", "Habit", "None"])
        });

        const structuredLlm = llm.withStructuredOutput(schema, { name: "route" });

        const messages = [
            new SystemMessage(systemPrompt),
            ...state.messages
        ];

        const response = await structuredLlm.invoke(messages);
        return { next: response.next };
    };
};

module.exports = { createSupervisorNode };
