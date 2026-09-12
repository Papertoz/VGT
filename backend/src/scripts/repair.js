const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const WeeklyPlan = require('../models/weeklyPlan.model');
const Exercise = require('../models/exercise.model');

const fixModels = () => {
    const aiPath = path.resolve(__dirname, '../ai');
    
    const walkSync = (dir, filelist = []) => {
      fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
          filelist = walkSync(dirFile, filelist);
        } else {
          filelist.push(dirFile);
        }
      });
      return filelist;
    };

    const files = walkSync(aiPath);
    let count = 0;
    files.forEach(file => {
      if (file.endsWith('.js')) {
        let content = fs.readFileSync(file, 'utf8');
        if (content.includes('gemini-3.5-flash')) {
          content = content.replace(/gemini-3.5-flash/g, 'gemini-3.6-flash');
          fs.writeFileSync(file, content);
          count++;
        }
      } 
    });
    console.log(`[Fix Models] Replaced 'gemini-3.5-flash' with 'gemini-3.6-flash' in ${count} files.`);
};

const repairPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('[Repair Plans] Connected to MongoDB');

        const allExercises = await Exercise.find();
        if (allExercises.length === 0) {
            console.log('[Repair Plans] No exercises found in DB. Please seed first.');
            return;
        }

        const getRandomExercise = () => allExercises[Math.floor(Math.random() * allExercises.length)]._id;

        const plans = await WeeklyPlan.find();
        let updatedCount = 0;

        for (let plan of plans) {
            let planModified = false;
            if (plan.days && plan.days.length > 0) {
                for (let day of plan.days) {
                    if (day.exercises && day.exercises.length > 0) {
                        for (let ex of day.exercises) {
                            if (!ex.exercise) continue;
                            const exists = allExercises.find(e => e._id.toString() === ex.exercise.toString());
                            if (!exists) {
                                ex.exercise = getRandomExercise();
                                planModified = true;
                            }
                        }
                    }
                }
            }
            if (planModified) {
                await plan.save();
                updatedCount++;
            }
        }
        
        console.log(`[Repair Plans] Repaired ${updatedCount} weekly plans with broken exercise references.`);
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
};

const run = async () => {
    fixModels();
    await repairPlans();
    console.log('Repair complete!');
};

run();
