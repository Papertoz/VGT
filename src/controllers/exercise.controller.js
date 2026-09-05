const Exercise = require("../models/exercise.model");

const createExercise = async(req,res)=>{
    try{
        const exercise = await Exercise.create({
            name:req.body.name,
            muscleGroup:req.body.muscleGroup,
            description:req.body.description,
            caloriesPerMinute:req.body.caloriesPerMinute,
            imageUrl:req.body.imageUrl,
            videoUrl:req.body.videoUrl
        });
        res.status(201).json({
            success:true,
            exercise
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

const getAllExercises = async(req,res)=>{
    try{
        const exercises = await Exercise.find();
        res.status(200).json({
            success:true,
            exercises
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

const getExerciseById = async(req,res)=>{
    try{
        const exercise = await Exercise.findById(
            req.params.id
        );
        if(!exercise){
            return res.status(404).json({
                success:false,
                message:"Exercise not found"
            });
        }
        res.status(200).json({
            success:true,
            exercise
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

const deleteExercisebyId = async(req,res)=>{
    try{
        const exercise = await Exercise.findByIdAndDelete(
            req.params.id
        );
        if(!exercise){
            return res.status(404).json({
                success:false,
                message:"Exercise not found"
            });
        }
        res.status(200).json({
            success:true,
            message:"Exercise deleted successfully"
        });
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};


module.exports = {
    createExercise,
    getAllExercises,
    getExerciseById,
    deleteExercisebyId
};