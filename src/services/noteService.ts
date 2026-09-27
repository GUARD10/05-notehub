import axios from "axios";
import type { NewNote, Note, NotesResponse } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (!token)
    throw new Error("Set VITE_NOTEHUB_TOKEN in .env and restart Vite.");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function fetchNotes(
  page: number,
  search: string,
  signal?: AbortSignal,
) {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: { page, perPage: 12, ...(search ? { search } : {}) },
    signal,
  });
  return data;
}

export async function createNote(note: NewNote) {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string) {
  await api.delete(`/notes/${encodeURIComponent(id)}`);
}
