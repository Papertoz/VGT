const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },

    muscleGroup:{
        type:String,
        required:true
    },

    description:{
        type:String
    },

    caloriesPerMinute:{
        type:Number,
        required:true
    },

    imageUrl:String,
    videoUrl:String
},{
    timestamps:true
});

module.exports = mongoose.model("Exercise",exerciseSchema);