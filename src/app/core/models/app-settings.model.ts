import { TranslatedField, LanguageCode } from './translated-field.model';

export type EmailProvider = 'resend' | 'smtp' | 'none';

export interface AppSettings {
  id: string;
  userId: string;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  emailProvider: EmailProvider;
  resendApiKey: string | null;
  resendFromEmail: string | null;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPassword: string | null;
  smtpFromEmail: string | null;
  smtpSecure: boolean;
  notificationEmail: string | null;
  whatsappNumber: string | null;
  whatsappDefaultMessage: TranslatedField | null;
  defaultLanguage: LanguageCode;
  activeLanguages: LanguageCode[];
  webhookUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
