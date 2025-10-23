// backend/controllers/noteController.js
import Note from "../models/Note.js";
import axios from "axios";

export const createNote = async (req, res) => {
  try {
   const { title, content } = req.body;
   const note = await Note.create({ title, content, user: req.user._id });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getNotes = async (req, res) => {
  try {
  const notes = await Note.find({ user: req.user._id })
  .sort({ date: -1 })
  .populate('user', 'name email');

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNote = async (req, res) => {
  try {
   const note = await Note.findById(req.params.id);
   if (note.user.toString() !== req.user._id.toString()) {
     return res.status(401).json({ error: "Not authorized" });
   }
   const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
   res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
   const note = await Note.findById(req.params.id);
   if (note.user.toString() !== req.user._id.toString()) {
     return res.status(401).json({ error: "Not authorized" });
   }
   await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const summarizeNote = async (req, res) => {
  const { text } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  // The user's desired model URL, without the API key in it.
  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  if (!text) {
    return res.status(400).json({ error: "Text to summarize is required." });
  }

  if (!API_KEY) {
    // This check is now more important than ever.
    return res.status(500).json({ error: "API key is not configured on the server. Please check the .env file." });
  }

  try {
    const response = await axios.post(
      API_URL,
      { // The request body
        contents: [{
          parts: [{ text: `Summarize the following text concisely:\n\n${text}` }]
        }]
      },
      { // The configuration object for axios
        headers: {
          'x-goog-api-key': API_KEY, // <-- Send the API key as a header
          'Content-Type': 'application/json'
        }
      }
    );

    const summary = response.data.candidates[0].content.parts[0].text;
    res.json({ summary });
  } catch (error) {
    console.error("Error calling summarization API:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate summary from the external service." });
  }
};