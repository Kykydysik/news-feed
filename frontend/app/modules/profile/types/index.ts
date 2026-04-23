export interface AuthRequestParams {
  email: string;
  password: string;
}

export interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  information: string;
  email: string;
  phone: string;
  password: string;
  birth_day: Date;
  created_at: Date;
  updated_at: Date;
}