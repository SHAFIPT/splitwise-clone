export interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  phone?: string | null;
  location?: string | null;
  avatarUrl?: string | null;
}
