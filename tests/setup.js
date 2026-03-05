import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Global test configuration
beforeAll(async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager_test";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected for tests");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Don't exit if connection fails, tests might still work
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    // Drop database
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    // Close connection
    await mongoose.connection.close();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Cleanup failed:", error.message);
  }
});