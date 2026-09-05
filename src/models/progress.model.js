const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    weight:Number,

    chest:Number,

    waist:Number,

    biceps:Number

},{
    timestamps:true
});

module.exports =
mongoose.model("Progress",progressSchema);