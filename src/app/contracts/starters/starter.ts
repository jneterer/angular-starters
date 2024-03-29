import { UserProfile } from "contracts/user/profile";

export interface Starter {
  id: string;
  created_at: string;
  has_been_active: boolean;
  status: StarterStatus;
  user_id: string;
  starter_name: string;
  github_url: string;
  package_json_url: string;
  demo_url: string | null;
  description: string;
  cover_photo: string;
  categories: string[];
  user?: UserProfile;
}

export interface StarterRevision {
  id: string;
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

export type StarterStatus = 'ACTIVE' | 'REVIEW' | 'REVISE' | 'REJECTED';

export interface StarterStatuses {
  value: StarterStatus;
  label: StarterStatus;
  description: string;
};