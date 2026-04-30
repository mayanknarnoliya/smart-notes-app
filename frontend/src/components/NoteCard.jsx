import { useState } from "react";
import axios from "axios";

export default function NoteCard({ note, onDelete, onUpdate }) {
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.post(`/api/notes/${note._id}/summarize`);
      onUpdate({ ...note, summary: res.data.summary });
    } catch (err) {
      alert("Failed to generate summary. Check your API key.");
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateTags = async () => {
    setLoadingTags(true);
    try {
      const res = await axios.post(`/api/notes/${note._id}/tags`);
      onUpdate({ ...note, tags: res.data.tags });
    } catch (err) {
      alert("Failed to generate tags. Check your API key.");
    } finally {
      setLoadingTags(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${note.title}"?`)) return;
    try {
      await axios.delete(`/api/notes/${note._id}`);
      onDelete(note._id);
    } catch (err) {
      alert("Failed to delete note.");
    }
  };

  // Determine border color from note color
  const borderColor = note.color && note.color !== "#ffffff" ? note.color : "#6c63ff";

  return (
    <div
      className="note-card"
      style={{
        background: note.color || "#ffffff",
        borderTop: `4px solid ${borderColor}`,
      }}
    >
      <div className="note-card-header">
        <div className="note-title">{note.title}</div>
      </div>

      <div className="note-content">{note.content}</div>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="note-tags">
          {note.tags.map((tag, i) => (
            <span key={i} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* AI Summary */}
      {note.summary && (
        <div className="note-summary">
          <strong>✨ AI Summary</strong>
          {note.summary}
        </div>
      )}

      {/* Actions */}
      <div className="note-actions">
        <button
          className="btn btn-ai"
          onClick={handleSummarize}
          disabled={loadingSummary}
          title="AI: Summarize this note"
        >
          {loadingSummary ? (
            <span className="spinner" />
          ) : (
            "✨"
          )}
          {loadingSummary ? " Summarizing..." : " Summarize"}
        </button>

        <button
          className="btn btn-ai"
          onClick={handleGenerateTags}
          disabled={loadingTags}
          title="AI: Generate tags"
        >
          {loadingTags ? (
            <span className="spinner" />
          ) : (
            "🏷️"
          )}
          {loadingTags ? " Tagging..." : " Auto Tags"}
        </button>

        <button
          className="btn btn-danger"
          onClick={handleDelete}
          title="Delete note"
        >
          🗑 Delete
        </button>

        <span className="note-date">{formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
}
