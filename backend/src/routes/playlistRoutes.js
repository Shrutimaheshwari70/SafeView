import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getPlaylists, createPlaylist, addVideoToPlaylist, deletePlaylist, updatePlaylistVideos } from "../controllers/playlistController.js";

const router = express.Router();
router.use(authMiddleware);

// GET playlists for a kid
router.get("/kid/:kidId/playlists-list", getPlaylists);

// CREATE playlist for a kid
router.post("/kid/:kidId/playlist-create", createPlaylist);

// ADD video to playlist
router.post("/kid/:kidId/playlist/:playlistId/add-video", addVideoToPlaylist);

// DELETE playlist
// router.delete("/kid/:kidId/playlist/:playlistId", deletePlaylist);
// router.delete("/parent/kid/:kidId/playlist/:playlistId", deletePlaylist);
// DELETE playlist
router.delete("/kid/:kidId/playlist/:playlistId", deletePlaylist);


// UPDATE playlist videos
router.patch("/kid/:kidId/playlist/:playlistId/videos", updatePlaylistVideos);

export default router;
