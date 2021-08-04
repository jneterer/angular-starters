export interface Starter {
  id: string;
  created_at: string;
  status: 'ACTIVE' | 'REVIEW' | 'REVISE' | 'REJECTED';
  user_id: string;
  starter_name: string;
  github_url: string;
  package_json_url: string;
  demo_url: string;
  description: string;
  cover_photo: string;
  categories: string[];
}

export interface StarterDto {
  user_id: string;
  starter_name: string;
  github_url: string;
  package_json_url: string;
  demo_url: string;
  description: string;
  cover_photo: string;
  categories: string[];
}