import mongoose from "mongoose";

const KidSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number },
  allowedCategories: [
    {
      type: String,
      enum: ["Sports","Gaming","News","Comedy","Music","Podcast","Documentary","Education"]
    }
  ]
}, { timestamps: true });

export default mongoose.model("Kid", KidSchema);
