export interface User {
 // id: string;
  email: string;
  username: string;
  avatar: string;
  // createdAt: Date;
  // updatedAt: Date;
}


export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  username: string;
};
