const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://pawarpranav640:HJzwfb9fpbyQ7Tju@cashflow.1txso.mongodb.net/";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

module.exports = connectToMongo;
