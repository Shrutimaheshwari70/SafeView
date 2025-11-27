// controllers/parentController.js
import Kid from "../models/Kid.js";
import Video from "../models/Video.js";
import Playlist from "../models/Playlist.js";
// Create Kid
export const getKidPlaylists = async (req, res) => {
  try {
    const { kidId } = req.params;

    const kid = await Kid.findOne({ _id: kidId, parent: req.user.id });
    if (!kid) return res.status(404).json({ message: "Kid not found" });

    const playlists = await Playlist
      .find({ kid: kidId })
      .populate("videos"); // IMPORTANT

    res.json({ playlists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const createKid = async (req, res) => {
  try {
    const { username, age, allowedCategories } = req.body;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const kid = await Kid.create({
      username,
      password: "123456", // default
      age,
      parent: req.user.id,
      allowedCategories: allowedCategories || [] // ensure categories
    });

    res.json({kid});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Kid Categories
export const updateKidCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const { categories } = req.body;

    const kid = await Kid.findOneAndUpdate(
      { _id: id, parent: req.user.id },
      { allowedCategories: categories },
      { new: true }
    );

    if (!kid) return res.status(404).json({ message: "Kid not found" });

    res.json({kid});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all Kids for Parent
export const getKids = async (req, res) => {
  try {
    const kids = await Kid.find({ parent: req.user.id }).select("username allowedCategories age");
    res.json({kids});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Videos allowed for Kid
export const getKidVideos = async (req, res) => {
  try {
    const kid = await Kid.findOne({ _id: req.params.kidId, parent: req.user.id });
    if (!kid) return res.status(404).json({ message: "Kid not found" });

    const videos = await Video.find({ category: { $in: kid.allowedCategories } });
    res.json({ videos }); // return as object with videos array
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

