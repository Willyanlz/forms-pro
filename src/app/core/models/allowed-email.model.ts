export interface AllowedEmail {
  id: string;
  userId: string | null;
  email: string;
  isRegistered: boolean;
  invitedAt: string;
  registeredAt: string | null;
}
