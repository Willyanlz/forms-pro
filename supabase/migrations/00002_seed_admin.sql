-- =============================================================================
-- Migration 00002: Seed Admin
-- Labs Will SaaS - Initial admin setup
--
-- PURPOSE:
--   This script is meant to be run AFTER the first user has registered through
--   Supabase Auth. Replace the placeholder UUID below with the actual user UUID
--   from your auth.users table before executing.
--
-- HOW TO GET YOUR USER UUID:
--   In the Supabase Dashboard → Authentication → Users → copy the UUID of the
--   first registered user, or run:
--     SELECT id, email FROM auth.users LIMIT 1;
--
-- USAGE:
--   1. Register your admin account via the app or Supabase Auth.
--   2. Copy your user UUID.
--   3. Replace '00000000-0000-0000-0000-000000000001' with your real UUID.
--   4. Run this script.
-- =============================================================================

DO $$
DECLARE
  v_user_id UUID := '00000000-0000-0000-0000-000000000001'; -- REPLACE WITH REAL USER UUID
BEGIN

  -- -------------------------------------------------------------------------
  -- admin_profile
  -- -------------------------------------------------------------------------
  INSERT INTO public.admin_profile (
    user_id,
    slug,
    display_name,
    description,
    photo_url,
    whatsapp_number
  )
  VALUES (
    v_user_id,
    'admin',                              -- slug for URL routing (e.g. /admin)
    'Administrador',
    'Perfil principal do administrador.',
    NULL,
    NULL
  )
  ON CONFLICT (user_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    updated_at   = NOW();

  -- -------------------------------------------------------------------------
  -- app_settings
  -- -------------------------------------------------------------------------
  INSERT INTO public.app_settings (
    user_id,
    primary_color,
    secondary_color,
    accent_color,
    email_provider,
    resend_api_key,
    resend_from_email,
    smtp_host,
    smtp_port,
    smtp_user,
    smtp_password,
    smtp_from_email,
    smtp_secure,
    notification_email,
    whatsapp_number,
    whatsapp_default_message,
    default_language,
    active_languages,
    webhook_url
  )
  VALUES (
    v_user_id,
    '#1A56DB',                           -- primary_color   (blue)
    '#6B7280',                           -- secondary_color (gray)
    '#F59E0B',                           -- accent_color    (amber)
    'none',                              -- email_provider: 'resend' | 'smtp' | 'none'
    NULL,                                -- resend_api_key
    NULL,                                -- resend_from_email
    NULL,                                -- smtp_host
    587,                                 -- smtp_port
    NULL,                                -- smtp_user
    NULL,                                -- smtp_password
    NULL,                                -- smtp_from_email
    FALSE,                               -- smtp_secure
    NULL,                                -- notification_email
    NULL,                                -- whatsapp_number
    '{"pt": "Olá! Sua solicitação foi recebida com sucesso.", "en": "Hello! Your request was received successfully.", "es": "Hola! Su solicitud fue recibida con éxito."}'::jsonb,
    'pt',                                -- default_language
    '["pt"]'::jsonb,                     -- active_languages
    NULL                                 -- webhook_url
  )
  ON CONFLICT (user_id) DO UPDATE SET
    updated_at = NOW();

END $$;
