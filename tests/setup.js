require("dotenv").config();

const mongoose = require("mongoose");

beforeAll(async () => {
  console.log("MONGO_TEST exists:", !!process.env.MONGO_TEST);

  await mongoose.connect(process.env.MONGO_TEST);

  console.log("Test MongoDB connected");
});

afterAll(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }

  await mongoose.connection.close();

  console.log("Test MongoDB closed");
});