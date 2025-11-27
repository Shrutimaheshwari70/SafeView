import Kid from "../models/Kid.js";
import Video from "../models/Video.js";

// 1️⃣ Get kid profile
export const getKidProfile = async (req, res) => {
  try {
    const kid = await Kid.findById(req.user.id).select("username allowedCategories");
    if (!kid) return res.status(404).json({ message: "Kid not found" });
    res.json(kid);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Get allowed videos
export const getAllowedVideos = async (req, res) => {
  try {
    const kid = await Kid.findById(req.user.id);
    if (!kid) return res.status(404).json({ message: "Kid not found" });

    const videos = await Video.find({
      category: { $in: kid.allowedCategories },
    });

    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
