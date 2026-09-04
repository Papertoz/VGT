const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }, 
    fullname:{
        type:String,
    },
    profilePicture:{
        type:String,
    },
    weight:{
        type:Number,
    },
    height:{
        type:Number,
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum
        :["male","female","other"]
    },
    level:{
        type:String,
        enum:["beginner","intermediate","advanced"]
    },

    isprofilecomplete:{
        type:Boolean,
        default:false
    },
    
    aiPreferences: {
        injuries: [String],
        equipmentAvailable: [String],
        fitnessGoal: String
    }
},
    {
        timestamps:true
    }
);

const User = mongoose.model('User',userSchema);
module.exports = User;