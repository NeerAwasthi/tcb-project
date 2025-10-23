// NoteForm.jsx
import React, { useState } from "react";
import api from "../services/api";

const NoteForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("Please add title and content");
    setSaving(true);
    try {
      const { data } = await api.post("/notes", { title: title.trim(), content: content.trim() });
      onAdd && onAdd(data);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="note-form glass" onSubmit={submit}>
      <input
        className="input title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        maxLength={100}
      />
      <textarea
        className="input content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows="5"
        placeholder="Write your note..."
      />
      <div className="form-row">
        <button className="btn primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : "Add Note"}
        </button>
        <div className="hint">Tip: use short titles for quick scanning</div>
      </div>
    </form>
  );
};

export default NoteForm;
