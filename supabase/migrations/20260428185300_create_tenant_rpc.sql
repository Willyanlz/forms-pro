-- Migration: Função RPC para Super Admin criar novos tenants
-- Data: 28/04/2026
-- Autor: Labs Will

CREATE OR REPLACE FUNCTION public.create_new_tenant(
  tenant_email TEXT,
  tenant_password TEXT,
  tenant_name TEXT,
  tenant_company TEXT DEFAULT NULL,
  tenant_phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Verifica se quem esta chamando é Super Admin
  IF NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Acesso negado: você não tem permissão para criar assinantes';
  END IF;

  -- Cria o usuario no auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    tenant_email,
    crypt(tenant_password, gen_salt('bf')),
    NOW(),
    NOW(),
    '{"role": "tenant"}'::jsonb,
    jsonb_build_object(
      'name', tenant_name,
      'company', tenant_company,
      'phone', tenant_phone
    )
  )
  RETURNING id INTO new_user_id;

  -- Cria o perfil do admin na tabela admin_profile
  INSERT INTO public.admin_profile (
    id,
    email,
    name,
    company,
    phone,
    plan_id,
    active,
    created_at
  ) VALUES (
    new_user_id,
    tenant_email,
    tenant_name,
    tenant_company,
    tenant_phone,
    (SELECT id FROM public.plans WHERE slug = 'free' LIMIT 1),
    true,
    NOW()
  );

  -- Marca automaticamente primeiro_acesso = true
  UPDATE public.admin_profile
  SET primeiro_acesso = true
  WHERE id = new_user_id;

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_new_tenant(TEXT, TEXT, TEXT, TEXT, TEXT) IS 'Permite Super Admin criar novos assinantes com senha inicial. O usuario sera obrigado a trocar a senha no primeiro acesso.';