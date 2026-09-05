const { StateGraph, START, END, Annotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { SystemMessage } = require("@langchain/core/messages");

// Import all agents
const { createWorkoutAgent } = require("../agents/workout.agent");
const { createNutritionAgent } = require("../agents/nutrition.agent");
const { createRecoveryAgent } = require("../agents/recovery.agent");
const { createProgressAgent } = require("../agents/progress.agent");
const { createGoalAgent } = require("../agents/goal.agent");
const { createHabitAgent } = require("../agents/habit.agent");
const { createSafetyAgent } = require("../agents/safety.agent");
const { createSupervisorNode } = require("../agents/supervisor.agent");

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
    const recoveryAgent = createRecoveryAgent(userPreferences);
    const progressAgent = createProgressAgent(userPreferences);
    const goalAgent = createGoalAgent(userPreferences);
    const habitAgent = createHabitAgent(userPreferences);
    const safetyAgent = createSafetyAgent(userPreferences);

    // Supervisor Node
    const supervisorNode = createSupervisorNode();

    // Node Wrappers
    const createAgentNode = (agent) => async (state) => {
        const response = await agent.invoke({ messages: state.messages });
        return { messages: response.messages.slice(state.messages.length) };
    };

    const callWorkoutAgent = createAgentNode(workoutAgent);
    const callNutritionAgent = createAgentNode(nutritionAgent);
    const callRecoveryAgent = createAgentNode(recoveryAgent);
    const callProgressAgent = createAgentNode(progressAgent);
    const callGoalAgent = createAgentNode(goalAgent);
    const callHabitAgent = createAgentNode(habitAgent);
    const callSafetyAgent = createAgentNode(safetyAgent);

    const callNoneAgent = async (state) => {
        const llm = new ChatGoogleGenerativeAI({
            model: "gemini-3.6-flash",
            temperature: 0,
            apiKey: process.env.GEMINI_API_KEY
        });
        const msg = await llm.invoke([
            new SystemMessage("You are a helpful fitness assistant. I can help with workouts, nutrition, recovery, progress, goals, habits, and safety. What do you need help with?"),
            ...state.messages
        ]);
        return { messages: [msg] };
    };

    // Build the Graph
    const workflow = new StateGraph(AgentState)
        .addNode("supervisor", supervisorNode)
        .addNode("Workout", callWorkoutAgent)
        .addNode("Nutrition", callNutritionAgent)
        .addNode("Recovery", callRecoveryAgent)
        .addNode("Progress", callProgressAgent)
        .addNode("Goal", callGoalAgent)
        .addNode("Habit", callHabitAgent)
        .addNode("Safety", callSafetyAgent)
        .addNode("None", callNoneAgent);

    workflow.addEdge(START, "supervisor");

    workflow.addConditionalEdges(
        "supervisor",
        (state) => state.next,
        {
            Workout: "Workout",
            Nutrition: "Nutrition",
            Recovery: "Recovery",
            Progress: "Progress",
            Goal: "Goal",
            Habit: "Habit",
            Safety: "Safety",
            None: "None"
        }
    );

    workflow.addEdge("Workout", END);
    workflow.addEdge("Nutrition", END);
    workflow.addEdge("Recovery", END);
    workflow.addEdge("Progress", END);
    workflow.addEdge("Goal", END);
    workflow.addEdge("Habit", END);
    workflow.addEdge("Safety", END);
    workflow.addEdge("None", END);

    return workflow.compile();
};

module.exports = { createSupervisorGraph };
