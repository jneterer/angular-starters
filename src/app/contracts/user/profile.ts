export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  user_name: string;
  role: 'user' | 'admin';
}