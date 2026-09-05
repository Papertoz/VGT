const { StateGraph, START, END, Annotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { createWorkoutAgent } = require("../agents/workout.agent");
const { createNutritionAgent } = require("../agents/nutrition.agent");

const AgentState = Annotation.Root({
    messages: Annotation({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    next: Annotation({
        reducer: (x, y) => y ?? x,
        default: () => "None"
    })
});

const createSupervisorGraph = (userId, userPreferences) => {
    
    // Initialize Agents
    const workoutAgent = createWorkoutAgent(userId, userPreferences);
    const nutritionAgent = createNutritionAgent(userPreferences);

    // Supervisor Node
    const supervisorNode = async (state) => {
        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-3.6-flash",
            temperature: 0,
            apiKey: process.env.GEMINI_API_KEY
        });

        const systemPrompt = `You are a Supervisor AI routing user requests to specialized agents.
Available Agents:
- Workout: For questions about exercises, workout plans, adapting workouts, or tracking progress.
- Nutrition: For questions about diet, protein, calories, meal plans.
- None: If the user is just saying hello or asking something irrelevant.

Analyze the conversation and decide the next agent.
`;
        
        const schema = z.object({
            next: z.enum(["Workout", "Nutrition", "None"])
        });
        
        const structuredLlm = llm.withStructuredOutput(schema, { name: "route" });
        
        const messages = [
            new SystemMessage(systemPrompt),
            ...state.messages
        ];
        
        const response = await structuredLlm.invoke(messages);
        return { next: response.next };
    };

    // Node Wrappers
    const callWorkoutAgent = async (state) => {
        const response = await workoutAgent.invoke({ messages: state.messages });
        return { messages: response.messages.slice(state.messages.length) };
    };

    const callNutritionAgent = async (state) => {
        const response = await nutritionAgent.invoke({ messages: state.messages });
        return { messages: response.messages.slice(state.messages.length) };
    };

    const callNoneAgent = async (state) => {
        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-3.6-flash",
            temperature: 0,
            apiKey: process.env.GEMINI_API_KEY
        });
        const msg = await llm.invoke([
            new SystemMessage("You are a helpful assistant. The user didn't ask about workouts or nutrition. Respond nicely but let them know you are a fitness coach."),
            ...state.messages
        ]);
        return { messages: [msg] };
    };

    // Build the Graph
    const workflow = new StateGraph(AgentState)
        .addNode("supervisor", supervisorNode)
        .addNode("Workout", callWorkoutAgent)
        .addNode("Nutrition", callNutritionAgent)
        .addNode("None", callNoneAgent);

    workflow.addEdge(START, "supervisor");

    workflow.addConditionalEdges(
        "supervisor",
        (state) => state.next,
        {
            Workout: "Workout",
            Nutrition: "Nutrition",
            None: "None"
        }
    );

    workflow.addEdge("Workout", END);
    workflow.addEdge("Nutrition", END);
    workflow.addEdge("None", END);

    return workflow.compile();
};

module.exports = { createSupervisorGraph };
