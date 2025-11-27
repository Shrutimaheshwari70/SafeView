import Playlist from "../models/Playlist.js";
import Kid from "../models/Kid.js";

// GET all playlists of a kid
export const getPlaylists = async (req, res) => {
  try {
    const { kidId } = req.params;

    const kid = await Kid.findOne({ _id: kidId, parent: req.user.id });
    if (!kid) return res.status(404).json({ message: "Kid not found" });

    const playlists = await Playlist.find({ kid: kidId }).populate("videos");

    res.json({ playlists });
  } catch (err) {
    console.error("PLAYLIST ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST create playlist
export const createPlaylist = async (req, res) => {
  try {
    const { kidId } = req.params;
    const { videoIds, name } = req.body;

    const kid = await Kid.findOne({ _id: kidId, parent: req.user.id });
    if (!kid) return res.status(404).json({ message: "Kid not found" });

    const playlist = await Playlist.create({
      kid: kidId,
      name: name || "New Playlist",
      videos: videoIds || []
    });

    res.json(playlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const addVideoToPlaylist = async (req, res) => {
  try {
    const { kidId, playlistId } = req.params;
    const { videoId } = req.body;

    // Check playlist exists and belongs to this kid
    const playlist = await Playlist.findOne({ _id: playlistId, kid: kidId });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    // Add video if not already in playlist
    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }

    const updatedPlaylist = await Playlist.findById(playlistId).populate("videos");
    res.json(updatedPlaylist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a playlist
export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const deleted = await Playlist.findByIdAndDelete(playlistId);
    if (!deleted) return res.status(404).json({ message: "Playlist not found" });
    res.json({ message: "Playlist deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE videos in a playlist
export const updatePlaylistVideos = async (req, res) => {
  try {
    const { kidId, playlistId } = req.params;
    const { videos } = req.body;

    const playlist = await Playlist.findOne({ _id: playlistId, kid: kidId });
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });

    playlist.videos = videos || [];
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlistId).populate("videos");
    res.json(updatedPlaylist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
