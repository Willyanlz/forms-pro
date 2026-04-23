import { TranslatedField, LanguageCode } from './translated-field.model';

export type EmailProvider = 'resend' | 'smtp' | 'none';

export interface AppSettings {
  id: string;
  user_id: string;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  email_provider: EmailProvider;
  resend_api_key: string | null;
  resend_from_email: string | null;
  smtp_host: string | null;
  smtp_port: number | null;
  smtp_user: string | null;
  smtp_password: string | null;
  smtp_from_email: string | null;
  smtp_secure: boolean;
  notification_email: string | null;
  whatsapp_number: string | null;
  whatsapp_default_message: TranslatedField | null;
  default_language: LanguageCode;
  active_languages: LanguageCode[];
  webhook_url: string | null;
  created_at: string;
  updated_at: string;
}

export function createDefaultAppSettings(): AppSettings {
  return {
    id: '',
    user_id: '',
    primary_color: '#F5A623',
    secondary_color: '#1A1A2E',
    accent_color: '#E8F4FD',
    email_provider: 'none',
    resend_api_key: null,
    resend_from_email: null,
    smtp_host: null,
    smtp_port: null,
    smtp_user: null,
    smtp_password: null,
    smtp_from_email: null,
    smtp_secure: false,
    notification_email: null,
    whatsapp_number: null,
    whatsapp_default_message: { pt: '' },
    default_language: 'pt',
    active_languages: ['pt'],
    webhook_url: null,
    created_at: '',
    updated_at: '',
  };
}
