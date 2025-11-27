import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import { getKidProfile, getAllowedVideos } from "../controllers/kidController.js";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("kid"));

// Get kid profile
router.get("/me", getKidProfile);

// Get allowed videos for kid
router.get("/me/videos", getAllowedVideos);

export default router;
