// backend/routes/noteRoutes.js
import express from "express";
import { createNote, getNotes, updateNote, deleteNote, summarizeNote } from "../controllers/noteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.route("/").post(protect, createNote).get(protect, getNotes);
router.route("/:id").put(protect, updateNote).delete(protect, deleteNote);

router.post("/summarize", protect, summarizeNote);

export default router;