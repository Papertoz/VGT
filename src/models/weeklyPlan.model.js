const mongoose = require("mongoose");

const weeklyPlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    days:[
        {
            day:{
                type:String,
                enum:[
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday"
                ]
            },

            exercises:[
                {
                    exercise:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"Exercise"
                    },

                    duration:Number,
                    sets:Number,
                    reps:Number
                }
            ]
        }
    ]

},{
    timestamps:true
});

weeklyPlanSchema.index(
    { user: 1, isActive: 1 },
    {
        unique: true,  
        partialFilterExpression: { isActive: true }
    }
);

module.exports = mongoose.model("WeeklyPlan",weeklyPlanSchema);