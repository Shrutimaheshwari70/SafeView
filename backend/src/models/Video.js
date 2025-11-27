import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  title: String,
  url: String,
  thumbnail: String,
  category: {
    type: String,
    enum: ["Sports","Gaming","News","Comedy","Music","Podcast","Documentary","Education"]
  }
}, { timestamps: true });

export default mongoose.model("Video", VideoSchema);
