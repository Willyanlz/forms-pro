-- =============================================================================
-- Migration 00001: Create Schema
-- Labs Will SaaS - Full database schema
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ---------------------------------------------------------------------------
-- 2. UPDATED_AT TRIGGER FUNCTION
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ---------------------------------------------------------------------------
-- 3. TABLE: admin_profile
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_profile (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug            TEXT        UNIQUE,
  display_name    TEXT,
  description     TEXT,
  photo_url       TEXT,
  whatsapp_number TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_profile_user_id_idx ON public.admin_profile(user_id);
CREATE INDEX IF NOT EXISTS admin_profile_slug_idx ON public.admin_profile(slug);

CREATE TRIGGER trg_admin_profile_updated_at
  BEFORE UPDATE ON public.admin_profile
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.admin_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_profile: owner can manage"
  ON public.admin_profile
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_profile: public can read"
  ON public.admin_profile
  FOR SELECT
  USING (TRUE);


-- ---------------------------------------------------------------------------
-- 4. TABLE: app_settings
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_settings (
  id                        UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_color             TEXT,
  secondary_color           TEXT,
  accent_color              TEXT,
  email_provider            TEXT        CHECK (email_provider IN ('resend', 'smtp', 'none')) DEFAULT 'none',
  resend_api_key            TEXT,
  resend_from_email         TEXT,
  smtp_host                 TEXT,
  smtp_port                 INTEGER,
  smtp_user                 TEXT,
  smtp_password             TEXT,
  smtp_from_email           TEXT,
  smtp_secure               BOOLEAN     DEFAULT FALSE,
  notification_email        TEXT,
  whatsapp_number           TEXT,
  whatsapp_default_message  JSONB,
  default_language          TEXT        CHECK (default_language IN ('pt', 'en', 'es')) DEFAULT 'pt',
  active_languages          JSONB       DEFAULT '["pt"]'::jsonb,
  webhook_url               TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS app_settings_user_id_idx ON public.app_settings(user_id);

CREATE TRIGGER trg_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "app_settings: owner can manage"
  ON public.app_settings
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ---------------------------------------------------------------------------
-- 5. TABLE: form_templates
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_templates (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title         JSONB       NOT NULL DEFAULT '{}'::jsonb,
  description   JSONB       DEFAULT '{}'::jsonb,
  slug          TEXT        UNIQUE,
  status        TEXT        CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'draft',
  display_order INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS form_templates_user_id_idx    ON public.form_templates(user_id);
CREATE INDEX IF NOT EXISTS form_templates_status_idx     ON public.form_templates(status);
CREATE INDEX IF NOT EXISTS form_templates_slug_idx       ON public.form_templates(slug);
CREATE INDEX IF NOT EXISTS form_templates_display_order_idx ON public.form_templates(display_order);

CREATE TRIGGER trg_form_templates_updated_at
  BEFORE UPDATE ON public.form_templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.form_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "form_templates: owner can manage"
  ON public.form_templates
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "form_templates: public can read active"
  ON public.form_templates
  FOR SELECT
  USING (status = 'active');


-- ---------------------------------------------------------------------------
-- 6. TABLE: form_sections
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_sections (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id   UUID        NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  title         JSONB       NOT NULL DEFAULT '{}'::jsonb,
  description   JSONB       DEFAULT '{}'::jsonb,
  display_order INTEGER     DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS form_sections_template_id_idx    ON public.form_sections(template_id);
CREATE INDEX IF NOT EXISTS form_sections_display_order_idx  ON public.form_sections(template_id, display_order);

CREATE TRIGGER trg_form_sections_updated_at
  BEFORE UPDATE ON public.form_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.form_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "form_sections: owner can manage"
  ON public.form_sections
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.form_templates ft
      WHERE ft.id = form_sections.template_id
        AND ft.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.form_templates ft
      WHERE ft.id = form_sections.template_id
        AND ft.user_id = auth.uid()
    )
  );

CREATE POLICY "form_sections: public can read active template sections"
  ON public.form_sections
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.form_templates ft
      WHERE ft.id = form_sections.template_id
        AND ft.status = 'active'
    )
  );


-- ---------------------------------------------------------------------------
-- 7. TABLE: form_fields
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_fields (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id            UUID        NOT NULL REFERENCES public.form_sections(id) ON DELETE CASCADE,
  template_id           UUID        NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  label                 JSONB       NOT NULL DEFAULT '{}'::jsonb,
  placeholder           JSONB       DEFAULT '{}'::jsonb,
  helper_text           JSONB       DEFAULT '{}'::jsonb,
  field_type            TEXT        NOT NULL CHECK (
                                      field_type IN (
                                        'text','textarea','number','money','date',
                                        'radio','checkbox','select','email','phone',
                                        'cpf','cnpj','cep','url','toggle'
                                      )
                                    ),
  options               JSONB,
  default_currency      TEXT        DEFAULT 'BRL',
  is_required           BOOLEAN     DEFAULT FALSE,
  min_length            INTEGER,
  max_length            INTEGER,
  min_value             NUMERIC,
  max_value             NUMERIC,
  display_order         INTEGER     DEFAULT 0,
  is_active             BOOLEAN     DEFAULT TRUE,
  conditional_field_id  UUID        REFERENCES public.form_fields(id) ON DELETE SET NULL,
  conditional_value     TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS form_fields_section_id_idx      ON public.form_fields(section_id);
CREATE INDEX IF NOT EXISTS form_fields_template_id_idx     ON public.form_fields(template_id);
CREATE INDEX IF NOT EXISTS form_fields_display_order_idx   ON public.form_fields(section_id, display_order);
CREATE INDEX IF NOT EXISTS form_fields_is_active_idx       ON public.form_fields(is_active);

CREATE TRIGGER trg_form_fields_updated_at
  BEFORE UPDATE ON public.form_fields
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.form_fields ENABLE ROW LEVEL SECURITY;

CREATE POLICY "form_fields: owner can manage"
  ON public.form_fields
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.form_templates ft
      WHERE ft.id = form_fields.template_id
        AND ft.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.form_templates ft
      WHERE ft.id = form_fields.template_id
        AND ft.user_id = auth.uid()
    )
  );

CREATE POLICY "form_fields: public can read active template fields"
  ON public.form_fields
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.form_templates ft
      WHERE ft.id = form_fields.template_id
        AND ft.status = 'active'
    )
  );


-- ---------------------------------------------------------------------------
-- 8. TABLE: form_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.form_submissions (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  template_id     UUID        NOT NULL REFERENCES public.form_templates(id) ON DELETE CASCADE,
  template_title  TEXT,
  submitter_name  TEXT,
  submitter_email TEXT,
  answers         JSONB       DEFAULT '{}'::jsonb,
  status          TEXT        CHECK (status IN ('new', 'read', 'archived')) DEFAULT 'new',
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address      TEXT,
  user_agent      TEXT
);

CREATE INDEX IF NOT EXISTS form_submissions_user_id_idx     ON public.form_submissions(user_id);
CREATE INDEX IF NOT EXISTS form_submissions_template_id_idx ON public.form_submissions(template_id);
CREATE INDEX IF NOT EXISTS form_submissions_status_idx      ON public.form_submissions(status);
CREATE INDEX IF NOT EXISTS form_submissions_submitted_at_idx ON public.form_submissions(submitted_at DESC);

CREATE TRIGGER trg_form_submissions_updated_at
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- Trigger: auto-populate form_submissions.user_id from form_templates.user_id
CREATE OR REPLACE FUNCTION public.set_submission_user_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    SELECT ft.user_id
      INTO NEW.user_id
      FROM public.form_templates ft
     WHERE ft.id = NEW.template_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_form_submissions_set_user_id
  BEFORE INSERT ON public.form_submissions
  FOR EACH ROW EXECUTE FUNCTION public.set_submission_user_id();

ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "form_submissions: owner can manage own submissions"
  ON public.form_submissions
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "form_submissions: public can insert"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (TRUE);


-- ---------------------------------------------------------------------------
-- 9. TABLE: allowed_emails
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.allowed_emails (
  id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT        NOT NULL,
  is_registered   BOOLEAN     DEFAULT FALSE,
  invited_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  registered_at   TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS allowed_emails_email_idx   ON public.allowed_emails(email);
CREATE INDEX IF NOT EXISTS allowed_emails_user_id_idx        ON public.allowed_emails(user_id);
CREATE INDEX IF NOT EXISTS allowed_emails_is_registered_idx  ON public.allowed_emails(is_registered);

ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allowed_emails: owner can manage"
  ON public.allowed_emails
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "allowed_emails: public can read own invite by email"
  ON public.allowed_emails
  FOR SELECT
  USING (email = auth.email());


-- ---------------------------------------------------------------------------
-- 10. STORAGE: profile-images bucket
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', TRUE)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "profile-images: public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "profile-images: owner upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "profile-images: owner update"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "profile-images: owner delete"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
