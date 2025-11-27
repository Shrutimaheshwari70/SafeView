import mongoose from "mongoose";
import Video from "../src/models/Video.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function seedVideos() {
  try {
    //  ⚠️ No options needed for mongoose v7+
    await mongoose.connect(process.env.MONGO_URI);

    console.log("📌 MongoDB (Atlas) connected");

    const data = JSON.parse(fs.readFileSync("seed/videos.json", "utf-8"));

    await Video.deleteMany({});
    console.log("🗑️ Old videos deleted");

    await Video.insertMany(data);
    console.log("✅ New videos inserted");

    await mongoose.connection.close();
    console.log("🔌 DB connection closed");
  } catch (err) {
    console.error("❌ Error:", err);
    await mongoose.connection.close();
  }
}

seedVideos();
