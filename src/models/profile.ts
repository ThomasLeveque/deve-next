export interface Profile {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: 'editor' | 'admin';
  createdAt: string;
  updatedAt: string;
}
