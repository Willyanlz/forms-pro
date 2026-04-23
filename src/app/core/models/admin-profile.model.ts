export interface AdminProfile {
  id: string;
  userId: string;
  slug: string | null;
  displayName: string | null;
  description: string | null;
  photoUrl: string | null;
  whatsappNumber: string | null;
  createdAt: string;
  updatedAt: string;
}
