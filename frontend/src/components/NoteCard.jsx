// NoteCard.jsx
import React, { useState } from "react";
import api from "../services/api";

const NoteCard = ({ note, onDelete, onUpdate }) => {
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${note._id}`);
      onDelete && onDelete(note._id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill title and content");
      return;
    }
    setSaving(true);
    try {
      const { data } = await api.put(`/notes/${note._id}`, {
        title: title.trim(),
        content: content.trim(),
      });
      onUpdate && onUpdate(data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="note-card glass-2">
      {editing ? (
        <>
          <input
            className="input title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
          <textarea
            className="input content"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="note-foot">
            <button
              className="btn small primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              className="btn small"
              onClick={() => {
                setEditing(false);
                setTitle(note.title);
                setContent(note.content);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="note-head">
            <h3 className="note-title">{note.title}</h3>
            <div className="btn-row">
              <button
                className="btn small"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="btn small danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
          <p className="note-content">{note.content}</p>
          <div className="note-foot">
            <small>{new Date(note.date).toLocaleString()}</small>
          </div>
        </>
      )}
    </article>
  );
};

export default NoteCard;
