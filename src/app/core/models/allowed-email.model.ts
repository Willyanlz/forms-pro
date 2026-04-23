export interface AllowedEmail {
  id: string;
  user_id: string | null;
  email: string;
  is_registered: boolean;
  invited_at: string;
  registered_at: string | null;
}
