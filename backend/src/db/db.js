const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  }
  catch(err){
    console.log("Cannot able to connect to DB");
    console.log(err);
    process.exit(1);
  }
}

module.exports = connectDB;