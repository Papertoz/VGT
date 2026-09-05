const express = require('express');
const authRoutes = require('./routes/auth.routes');
const cookieParser = require('cookie-parser');
const postRoutes = require('./routes/post.routes');
const exerciseRoutes = require("./routes/exercise.routes");
const weeklyPlanRoutes = require("./routes/weeklyPlan.routes");
const workoutRoutes = require("./routes/workout.routes");
const aiRoutes = require("./routes/ai.routes");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/details',postRoutes);
app.use("/api/exercises",exerciseRoutes);
app.use("/api/weeklyplan",weeklyPlanRoutes);
app.use("/api/workout",workoutRoutes);
app.use("/api/ai",aiRoutes);
module.exports = app;