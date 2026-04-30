const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
const Note = require("../models/Note");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// GET all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// GET single note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// POST create note
router.post("/", async (req, res) => {
  try {
    const { title, content, color } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }
    const note = new Note({ title, content, color: color || "#ffffff" });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
});

// DELETE note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// PUT update note
router.put("/:id", async (req, res) => {
  try {
    const { title, content, color } = req.body;
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, color },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
});

// ✨ AI FEATURE 1: Summarize a note (Groq)
router.post("/:id/summarize", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Summarize the following note in 2-3 concise sentences. Only return the summary, nothing else.\n\nTitle: ${note.title}\n\nContent: ${note.content}`,
        },
      ],
    });

    const summary = completion.choices[0].message.content;
    note.summary = summary;
    await note.save();

    res.json({ summary });
  } catch (err) {
    console.error("AI summarize error:", err);
    res.status(500).json({ error: "Failed to generate summary." });
  }
});

// ✨ AI FEATURE 2: Generate tags for a note (Groq)
router.post("/:id/tags", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `Generate 3-5 relevant tags for this note. Return ONLY a JSON array of lowercase tag strings, nothing else. Example: ["productivity", "ideas", "work"]\n\nTitle: ${note.title}\n\nContent: ${note.content}`,
        },
      ],
    });

    const text = completion.choices[0].message.content;

    let tags = [];
    try {
      const cleaned = text.replace(/```json|```/g, "").trim();
      tags = JSON.parse(cleaned);
    } catch {
      tags = text.match(/"([^"]+)"/g)?.map((t) => t.replace(/"/g, "")) || [];
    }

    note.tags = tags;
    await note.save();

    res.json({ tags });
  } catch (err) {
    console.error("AI tags error:", err);
    res.status(500).json({ error: "Failed to generate tags." });
  }
});

module.exports = router;