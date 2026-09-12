/**
 * Seed script to populate the database with common exercises and their images.
 * Run: node src/scripts/seed-exercises.js
 * Requires MONGO_URI in the ../.env file
 */

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require("dotenv").config({ path: require("path").resolve(__dirname, "../../../.env") });
const mongoose = require("mongoose");
const Exercise = require("../models/exercise.model");

const exercises = [
  // ── Chest ──
  {
    name: "Bench Press",
    muscleGroup: "Chest",
    description: "Lie flat on a bench, grip the barbell slightly wider than shoulder-width, lower to your chest and press up.",
    caloriesPerMinute: 8,
    imageUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop", // Barbell bench
  },
  {
    name: "Incline Bench Press",
    muscleGroup: "Chest",
    description: "Set the bench to 30-45 degrees. Press the barbell from upper chest to lockout.",
    caloriesPerMinute: 8,
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop", // Incline press
  },
  {
    name: "Push-ups",
    muscleGroup: "Chest",
    description: "Bodyweight exercise. Keep body straight, lower chest to floor, push back up.",
    caloriesPerMinute: 7,
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=600&auto=format&fit=crop", // Push-up
  },
  {
    name: "Cable Fly",
    muscleGroup: "Chest",
    description: "Stand between cable towers, bring handles together in a hugging motion with slight bend in elbows.",
    caloriesPerMinute: 6,
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop", // Cable machine fly
  },

  // ── Back ──
  {
    name: "Lat Pulldown",
    muscleGroup: "Back",
    description: "Grip the bar wide, pull down to upper chest while squeezing shoulder blades together.",
    caloriesPerMinute: 7,
    imageUrl: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=600&auto=format&fit=crop", // Lat pulldown machine
  },
  {
    name: "Bent-Over Row",
    muscleGroup: "Back",
    description: "Hinge at the hips, pull the barbell to your lower chest while keeping your back flat.",
    caloriesPerMinute: 8,
    imageUrl: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=600&auto=format&fit=crop", // Barbell row
  },
  {
    name: "Pull-ups",
    muscleGroup: "Back",
    description: "Hang from a bar with overhand grip, pull your chin above the bar.",
    caloriesPerMinute: 9,
    imageUrl: "https://images.unsplash.com/photo-1598971457999-ca4ef48a9a71?w=600&auto=format&fit=crop", // Pull-up
  },
  {
    name: "Dumbbell Row",
    muscleGroup: "Back",
    description: "One arm on a bench for support, row a dumbbell from full extension to your hip.",
    caloriesPerMinute: 7,
    imageUrl: "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=600&auto=format&fit=crop", // Dumbbell row
  },

  // ── Shoulders ──
  {
    name: "Overhead Press",
    muscleGroup: "Shoulders",
    description: "Press the barbell or dumbbells from shoulder height to full lockout overhead.",
    caloriesPerMinute: 7,
    imageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=600&auto=format&fit=crop", // Dumbbell shoulder press
  },
  {
    name: "Lateral Raise",
    muscleGroup: "Shoulders",
    description: "Hold dumbbells at sides, raise arms out to the sides until parallel with floor.",
    caloriesPerMinute: 5,
    imageUrl: "https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=600&auto=format&fit=crop", // Lateral raise
  },
  {
    name: "Face Pull",
    muscleGroup: "Shoulders",
    description: "Use a rope attachment on cable machine, pull towards your face with elbows high.",
    caloriesPerMinute: 5,
    imageUrl: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&auto=format&fit=crop", // Cable machine back/shoulders
  },

  // ── Biceps ──
  {
    name: "Bicep Curl",
    muscleGroup: "Biceps",
    description: "Hold dumbbells or barbell with underhand grip, curl up to shoulder level.",
    caloriesPerMinute: 5,
    imageUrl: "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=600&auto=format&fit=crop", // Dumbbell curl
  },
  {
    name: "Hammer Curl",
    muscleGroup: "Biceps",
    description: "Hold dumbbells with neutral grip (palms facing each other), curl to shoulders.",
    caloriesPerMinute: 5,
    imageUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop", // Neutral grip curl
  },

  // ── Triceps ──
  {
    name: "Tricep Dip",
    muscleGroup: "Triceps",
    description: "Support yourself on parallel bars or a bench, lower and press back up using triceps.",
    caloriesPerMinute: 7,
    imageUrl: "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=600&auto=format&fit=crop", // Dips
  },
  {
    name: "Tricep Pushdown",
    muscleGroup: "Triceps",
    description: "Use cable machine with rope or bar attachment, push down from chest to full extension.",
    caloriesPerMinute: 5,
    imageUrl: "https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=600&auto=format&fit=crop", // Cable pushdown
  },

  // ── Legs ──
  {
    name: "Squat",
    muscleGroup: "Legs",
    description: "Bar on upper back, feet shoulder-width, squat down until thighs are parallel, drive back up.",
    caloriesPerMinute: 10,
    imageUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop", // Squat rack
  },
  {
    name: "Leg Press",
    muscleGroup: "Legs",
    description: "Sit in leg press machine, push the platform away by extending your knees and hips.",
    caloriesPerMinute: 8,
    imageUrl: "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=600&auto=format&fit=crop", // Leg press
  },
  {
    name: "Lunges",
    muscleGroup: "Legs",
    description: "Step forward, lower back knee toward the floor, push back to starting position.",
    caloriesPerMinute: 7,
    imageUrl: "https://images.unsplash.com/photo-1609899464726-209befab8463?w=600&auto=format&fit=crop", // Lunges
  },
  {
    name: "Leg Curl",
    muscleGroup: "Legs",
    description: "Lie face down on the leg curl machine, curl weight towards your glutes.",
    caloriesPerMinute: 6,
    imageUrl: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop", // Gym machine
  },
  {
    name: "Leg Extension",
    muscleGroup: "Legs",
    description: "Sit in leg extension machine, extend legs to straighten knees against resistance.",
    caloriesPerMinute: 5,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&auto=format&fit=crop", // Machine
  },
  {
    name: "Calf Raises",
    muscleGroup: "Legs",
    description: "Stand on the edge of a step, raise heels as high as possible, lower and repeat.",
    caloriesPerMinute: 4,
    imageUrl: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop", // Leg workout
  },

  // ── Glutes ──
  {
    name: "Hip Thrust",
    muscleGroup: "Glutes",
    description: "Back against bench, barbell on hips, drive hips upward squeezing glutes at the top.",
    caloriesPerMinute: 8,
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?w=600&auto=format&fit=crop", // Barbell hip thrust
  },
  {
    name: "Romanian Deadlift",
    muscleGroup: "Glutes",
    description: "Hold barbell, hinge at hips keeping legs slightly bent, lower bar along shins, return.",
    caloriesPerMinute: 8,
    imageUrl: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&auto=format&fit=crop", // RDL
  },

  // ── Core ──
  {
    name: "Plank",
    muscleGroup: "Core",
    description: "Hold a push-up position on forearms, keep body straight, engage core.",
    caloriesPerMinute: 4,
    imageUrl: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=600&auto=format&fit=crop", // Plank
  },
  {
    name: "Crunches",
    muscleGroup: "Core",
    description: "Lie on back, knees bent, curl upper body toward knees using abs.",
    caloriesPerMinute: 5,
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop", // Core mat
  },
  {
    name: "Russian Twist",
    muscleGroup: "Core",
    description: "Sit with knees bent, lean back slightly, rotate torso side to side with or without weight.",
    caloriesPerMinute: 6,
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop", // Core twist
  },

  // ── Cardio ──
  {
    name: "Treadmill Run",
    muscleGroup: "Cardio",
    description: "Run at moderate to high intensity on a treadmill. Adjust speed and incline as needed.",
    caloriesPerMinute: 12,
    imageUrl: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop", // Treadmill
  },
  {
    name: "Jump Rope",
    muscleGroup: "Cardio",
    description: "Jump continuously over a skipping rope, keeping wrists relaxed and jumps small.",
    caloriesPerMinute: 13,
    imageUrl: "https://images.unsplash.com/photo-1517130038641-a774d04afb3c?w=600&auto=format&fit=crop", // Jump rope
  },
  {
    name: "Cycling",
    muscleGroup: "Cardio",
    description: "Ride a stationary bike at moderate intensity for cardiovascular conditioning.",
    caloriesPerMinute: 10,
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop", // Bike
  },

  // ── Full Body ──
  {
    name: "Deadlift",
    muscleGroup: "Full Body",
    description: "Stand over barbell, hinge and grip bar, drive through feet and hips to stand tall.",
    caloriesPerMinute: 10,
    imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&auto=format&fit=crop", // Deadlift
  },
  {
    name: "Burpees",
    muscleGroup: "Full Body",
    description: "Drop to push-up, perform push-up, jump feet forward, leap into the air.",
    caloriesPerMinute: 14,
    imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600&auto=format&fit=crop", // Burpees
  },
  {
    name: "Mountain Climbers",
    muscleGroup: "Full Body",
    description: "Plank position, rapidly alternate bringing knees to chest in a running motion.",
    caloriesPerMinute: 11,
    imageUrl: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=600&auto=format&fit=crop", // Climbers
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Clear existing exercises
    const existingCount = await Exercise.countDocuments();
    if (existingCount > 0) {
      console.log(`⚠ Deleting ${existingCount} existing exercises...`);
      await Exercise.deleteMany({});
      console.log("✓ Cleared existing exercises.");
    }

    const result = await Exercise.insertMany(exercises);
    console.log(`✓ Seeded ${result.length} exercises successfully!`);
    console.log("\nExercises by muscle group:");
    const groups = {};
    exercises.forEach(e => {
      groups[e.muscleGroup] = (groups[e.muscleGroup] || 0) + 1;
    });
    Object.entries(groups).forEach(([group, count]) => {
      console.log(`  ${group}: ${count}`);
    });
  } catch (err) {
    console.error("✗ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n✓ Disconnected from MongoDB");
    process.exit(0);
  }
}

seed();
