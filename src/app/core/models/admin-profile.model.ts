export interface AdminProfile {
  id: string;
  user_id: string;
  slug: string | null;
  display_name: string | null;
  description: string | null;
  photo_url: string | null;
  whatsapp_number: string | null;
  created_at: string;
  updated_at: string;
}
