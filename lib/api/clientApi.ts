import { Note, Tag } from "@/types/note";
import { User } from "@/types/user";
import { nextServer } from "./api";

export type TagSortBy = "created" | "updated";

//const authToken = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

// const instance = axios.create({
//   baseURL: "https://notehub-api.goit.study/",
//   headers: { Authorization: `Bearer ${authToken}` },
// });

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesRequest {
  search?: string;
  tag?: Tag;
  page?: number;
  sortBy?: TagSortBy;
}

export async function fetchNotes({
  search,
  tag,
  page,
  sortBy,
}: FetchNotesRequest): Promise<FetchNotesResponse> {
  const response = await nextServer.get<FetchNotesResponse>("notes", {
    params: {
      search,
      tag,
      page,
      perPage: 10,
      sortBy,
    },
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`notes/${id}`);
  return response.data;
}

export interface CreateNote {
  title: string;
  content: string;
  tag: Tag;
}

export async function createNote(params: CreateNote): Promise<Note> {
  const response = await nextServer.post<Note>("notes", params);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`notes/${id}`);
  return response.data;
}

export type RegisterRequest = {
  email: string;
  password: string;
  userName: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  https://www.edu.goit.global/uk/learn/35708654/48824017/48824056/homework
  Під час створення Zustand-стору в TypeScript використовуйте подвійні дужки після create, інакше типи визначаться некоректно. Наприклад:

create<AuthStore>()((set) => ({ ... }))
  password: string;
};

https://www.edu.goit.global/uk/learn/35708654/48824017/48824056/training?blockId=48824241
/ увесь попередній код

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/auth/me');
  return data;

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

export const getMe = async () => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};
