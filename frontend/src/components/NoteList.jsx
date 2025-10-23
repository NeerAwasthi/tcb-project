// NoteList.jsx
import React from "react";
import NoteCard from "./NoteCard";

const NoteList = ({ notes, loading, onDelete, setNotes }) => {
  // ✅ Update handler — replaces updated note in parent state
  const handleUpdate = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  };

  // ✅ Handle deletion in parent state after successful delete
  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n._id !== id));
    onDelete && onDelete(id);
  };

  if (loading) {
    return <div className="empty">Loading notes…</div>;
  }

  if (!notes || notes.length === 0) {
    return <div className="empty">No notes yet — add one on the left ✨</div>;
  }

  return (
    <div className="note-grid">
      {notes.map((n) => (
        <NoteCard
          key={n._id}
          note={n}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

export default NoteList;
