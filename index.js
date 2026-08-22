require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`Server starting on port ${PORT}...`);
  await connectDB();
});