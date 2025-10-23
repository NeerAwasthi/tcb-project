// backend/models/Note.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: {
   type: mongoose.Schema.Types.ObjectId,
   required: true,
   ref: "User",
  },
});

const Note = mongoose.model("Note", noteSchema);
export default Note;