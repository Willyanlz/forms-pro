-- ADICIONA CAMPO SUPER ADMIN NA TABELA DE PERFIS
ALTER TABLE admin_profile ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- CRIA INDICE PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_admin_profile_super_admin ON admin_profile(is_super_admin);

-- COMENTARIO PARA DOCUMENTACAO
COMMENT ON COLUMN admin_profile.is_super_admin IS 'Indica se o usuario tem acesso ao painel Super Admin do SaaS';

-- FUNCAO PARA VERIFICAR SE USUARIO É SUPER ADMIN
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profile
    WHERE user_id = auth.uid()
    AND is_super_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;
