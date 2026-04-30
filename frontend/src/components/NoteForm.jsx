import { useState } from "react";
import axios from "axios";

const NOTE_COLORS = [
  "#ffffff", "#fef3c7", "#d1fae5", "#dbeafe",
  "#fce7f3", "#ede9fe", "#fee2e2", "#e0f2fe",
];

export default function NoteForm({ onNoteAdded }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("/api/notes", { title, content, color });
      onNoteAdded(res.data);
      setTitle("");
      setContent("");
      setColor("#ffffff");
    } catch (err) {
      console.error(err);
      alert("Failed to add note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-note-form">
      <h2>📝 Add New Note</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="color-picker-row">
          <label>Color:</label>
          {NOTE_COLORS.map((c) => (
            <div
              key={c}
              className={`color-swatch ${color === c ? "active" : ""}`}
              style={{
                background: c,
                border: `2px solid ${c === "#ffffff" ? "#ddd" : c}`,
              }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !title.trim() || !content.trim()}
        >
          {loading ? <span className="spinner" /> : "＋"}
          {loading ? " Adding..." : " Add Note"}
        </button>
      </form>
    </div>
  );
}
