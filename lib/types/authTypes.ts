export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    username: string;
    email: string;
    display_name?: string;
  };
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  re_password: string;
  display_name?: string;
}

export interface ActivationData {
    uid: string;
    token: string;
  }