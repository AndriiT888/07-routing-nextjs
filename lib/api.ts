import axios, { type AxiosResponse } from "axios";
import type { Note, NoteTag } from "@/types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

// тільки те, що реально повертає API
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const res: AxiosResponse<FetchNotesResponse> = await api.get("/notes", { params });
  return res.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.post("/notes", payload);
  return res.data;
};

// API повертає видалену нотатку напряму
export const deleteNote = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.delete(`/notes/${id}`);
  return res.data;
};

// ✅ ДОДАТИ по вимозі ДЗ:
export const fetchNoteById = async (id: string): Promise<Note> => {
  const res: AxiosResponse<Note> = await api.get(`/notes/${id}`);
  return res.data;
};

console.log("TOKEN:", process.env.NEXT_PUBLIC_NOTEHUB_TOKEN);
