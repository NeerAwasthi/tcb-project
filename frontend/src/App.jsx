// frontend/src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import SummarizerPage from "./components/SummarizerPage"; // Import the new component
import api from "./services/api";

const NotesPage = ({ notes, setNotes, loading, addNote, removeNote }) => {
  return (
    <main className="container">
      <section className="left-pane">
        <h2 className="subtitle">Organize your thoughts</h2>
        <NoteForm onAdd={addNote} />
      </section>

      <section className="right-pane">
        <div className="top-row">
          <h2 className="subtitle">Your Notes</h2>
          <div className="stats">
            {loading ? "Loading..." : `${notes.length} note${notes.length !== 1 ? "s" : ""}`}
          </div>
        </div>
        <NoteList
          notes={notes}
          loading={loading}
          onDelete={removeNote}
          setNotes={setNotes}
        />
      </section>
    </main>
  );
};

function AppContent() {
  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const fetchNotes = useCallback(async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const { data } = await api.get("/notes");
      setNotes(data || []);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = (note) => setNotes((s) => [note, ...s]);
  const removeNote = (id) => setNotes((s) => s.filter((n) => n._id !== id));

  const handleLogin = (data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUserInfo(data);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setNotes([]);
    navigate("/login");
  };

  useEffect(() => {
    if (!userInfo && location.pathname !== "/login" && location.pathname !== "/signup") {
      navigate("/login");
    }
  }, [userInfo, location, navigate]);

  return (
    <div className="app-shell">
      <Header theme={theme} setTheme={setTheme} userInfo={userInfo} onLogout={handleLogout} />
      <Routes>
        <Route 
          path="/" 
          element={
            userInfo ? (
              <NotesPage 
                notes={notes} 
                setNotes={setNotes} 
                loading={loading} 
                addNote={addNote} 
                removeNote={removeNote} 
              />
            ) : null
          } 
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupPage onLogin={handleLogin} />} />
        <Route
          path="/summarizer"
          element={userInfo ? <SummarizerPage onNoteAdded={addNote} /> : null}
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}