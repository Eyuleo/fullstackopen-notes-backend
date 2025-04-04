import { test, after, beforeEach } from "node:test";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import assert from "node:assert";
import Note from "../models/note.js";

const api = supertest(app);

const initialNotes = [
  { content: "HTML is easy", important: false },
  { content: "Browser can execute only JavaScript", important: true },
];

beforeEach(async () => {
  await Note.deleteMany({});
  let noteObject = new Note(initialNotes[0]);
  await noteObject.save();
  noteObject = new Note(initialNotes[1]);
  await noteObject.save();
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two notes", async () => {
  const res = await api.get("/api/notes");

  assert.strictEqual(res.body.length, initialNotes.length);
});
test("the first note is about HTTP methods", async () => {
  const res = await api.get("/api/notes");

  const contents = res.body.map((e) => e.content);
  assert(contents.includes("HTML is easy"));
});

after(async () => {
  mongoose.connection.close();
});
