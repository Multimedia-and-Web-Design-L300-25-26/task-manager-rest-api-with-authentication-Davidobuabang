import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

let mongoServer;

// Global test configuration
beforeAll(async () => {
  try {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB in-memory server connected for tests");
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
    // Stop in-memory server
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Cleanup failed:", error.message);
  }
});