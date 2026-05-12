import { Note, Tag } from "@/types/note";
import { LoginRequest, RegisterRequest, User } from "@/types/user";
import { nextServer } from "./api";

export type TagSortBy = "created" | "updated";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesRequest {
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
  const response = await nextServer.get<FetchNotesResponse>("/notes", {
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
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
}

export interface CreateNote {
  title: string;
  content: string;
  tag: Tag;
}

export async function createNote(params: CreateNote): Promise<Note> {
  const response = await nextServer.post<Note>("/notes", params);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
}

// export type RegisterRequest = {
//   email: string;
//   password: string;
//   username: string;
// };

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

// export type LoginRequest = {
//   email: string;
//   password: string;
// };

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

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export type UpdateUserRequest = {
  username?: string;
};

export const updateMe = async (payload: UpdateUserRequest) => {

  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};
