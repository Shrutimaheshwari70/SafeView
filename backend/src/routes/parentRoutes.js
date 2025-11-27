import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createKid,
  updateKidCategories,
  getKidVideos,
  getKids,
  getKidPlaylists
} from "../controllers/parentController.js";

const router = express.Router();
router.use(authMiddleware);

// --- Kids ---
router.get("/kids", getKids);
router.post("/kid", createKid);
router.patch("/kid/:id/categories", updateKidCategories);
router.get("/kid/:kidId/videos", getKidVideos);

// --- Playlist Listing (read-only, optional) ---
router.get("/kid/:kidId/playlists", getKidPlaylists);

export default router;
