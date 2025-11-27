// models/Playlist.js
import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  kid: { type: mongoose.Schema.Types.ObjectId, ref: "Kid", required: true },
  name: { type: String, default: "New Playlist" },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }]
}, { timestamps: true });

export default mongoose.model("Playlist", PlaylistSchema);
