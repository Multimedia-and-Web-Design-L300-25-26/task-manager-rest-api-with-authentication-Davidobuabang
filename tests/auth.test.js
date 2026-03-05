import request from "supertest";
import app from "../src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Set up and tear down
let dbConnection;

beforeAll(async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/taskmanager_test";
    dbConnection = await mongoose.connect(mongoUri);
    console.log("Test DB connected");
  } catch (error) {
    console.error("Could not connect to test database:", error.message);
  }
}, 30000);

afterAll(async () => {
  try {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error closing test database:", error.message);
  }
}, 30000);

describe("Auth Routes", () => {

  let token;

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe("test@example.com");
  }, 30000);

  it("should login user and return token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@example.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  }, 30000);

});