// frontend/src/components/SummarizerPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SummarizerPage = ({ onNoteAdded }) => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to summarize.");
      return;
    }
    setLoading(true);
    setError("");
    setSummary("");

    try {
      
      const { data } = await api.post("/notes/summarize", { text: inputText });
      setSummary(data.summary);
    } catch (err) {
      console.error("Summarization call failed:", err);
      
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!summary.trim()) return;
    setSaving(true);
    try {
      const title = `Summary: ${new Date().toLocaleString()}`;
      const { data } = await api.post("/notes", { title, content: summary });
      onNoteAdded(data);
      navigate("/");
    } catch (err) {
      console.error("Failed to save note:", err);
      alert("Failed to save the note. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  
  
  return (
    <main className="container">
      <div className="left-pane" style={{ gap: "18px" }}>
        <h2 className="subtitle">Note Summarizer</h2>
        <div className="note-form glass">
          <textarea
            className="input content"
            rows="15"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your notes here to generate a summary..."
          />
          <button
            className="btn primary"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? "Generating..." : "Summarize"}
          </button>
          {error && <p style={{ color: "var(--danger)", marginTop: "10px" }}>{error}</p>}
        </div>
      </div>

      <div className="right-pane">
        <h2 className="subtitle">Summary Output</h2>
        <div className="note-card glass-2" style={{ minHeight: "300px" }}>
          {summary ? (
            <>
              <p className="note-content">{summary}</p>
              <div className="note-foot">
                <button
                  className="btn small primary"
                  onClick={handleSaveNote}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save as Note"}
                </button>
              </div>
            </>
          ) : (
            <div className="empty">
              {loading ? "Generating summary..." : "Your summary will appear here."}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SummarizerPage;