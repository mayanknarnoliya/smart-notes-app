import { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/notes");
      setNotes(res.data);
    } catch (err) {
      showToast("Failed to load notes", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNoteAdded = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
    showToast("Note added!");
  };

  const handleDelete = (id) => {
    setNotes((prev) => prev.filter((n) => n._id !== id));
    showToast("Note deleted");
  };

  const handleUpdate = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
  };

  const filteredNotes = notes.filter((note) => {
    const q = search.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      note.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <header className="header">
        <h1>📝 Smart Notes</h1>
        <input
          type="text"
          className="search-bar"
          placeholder="Search notes or tags..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="note-count">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </span>
      </header>

      <div className="container">
        <NoteForm onNoteAdded={handleNoteAdded} />

        {loading ? (
          <div className="empty-state">
            <span className="emoji">⏳</span>
            <h3>Loading notes...</h3>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <span className="emoji">{search ? "🔍" : "📭"}</span>
            <h3>{search ? "No notes found" : "No notes yet!"}</h3>
            <p>
              {search
                ? `No results for "${search}"`
                : "Add your first note above to get started."}
            </p>
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>{toast.msg}</div>
      )}
    </>
  );
}
