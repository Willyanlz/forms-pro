-- FUNCAO RPC PARA GERAR TOKEN DE IMPERSONACAO
CREATE OR REPLACE FUNCTION public.generate_impersonate_token(user_id UUID)
RETURNS TEXT AS $$
DECLARE
    jwt_token TEXT;
BEGIN
    -- VERIFICA SE QUEM CHAMA E SUPER ADMIN
    IF NOT public.is_super_admin() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    -- GERA TOKEN JWT ASSINADO PARA IMPERSONACAO
    SELECT sign(
        jsonb_build_object(
            'sub', user_id,
            'role', 'authenticated',
            'impersonated_by', auth.uid(),
            'exp', extract(epoch from now() + interval '1 hour')
        ),
        current_setting('app.settings.jwt_secret')
    ) INTO jwt_token;

    -- LOGA A ACAO
    INSERT INTO super_admin_logs (action, target_user_id, details)
    VALUES ('impersonate', user_id, jsonb_build_object('impersonated_by', auth.uid()));

    RETURN jwt_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.generate_impersonate_token(UUID) TO authenticated;

-- TABELA DE LOGS DO SUPER ADMIN
CREATE TABLE IF NOT EXISTS super_admin_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action VARCHAR NOT NULL,
    target_user_id UUID,
    details JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID DEFAULT auth.uid()
);

CREATE INDEX IF NOT EXISTS idx_super_admin_logs_created ON super_admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_super_admin_logs_action ON super_admin_logs(action);