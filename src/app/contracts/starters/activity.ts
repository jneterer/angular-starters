import { StarterStatus } from './starter';

export type StarterActivity = {
  id: string;
  starter_id: string;
  created_at: string;
  user_id: string;
  from_status?: StarterStatus;
  to_status?: StarterStatus;
  comment: string;
};