export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    name: string;
  };
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  password: string;
}