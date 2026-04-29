-- ADICIONA COLUNA BLOCKED NA TABELA ADMIN_PROFILE
ALTER TABLE admin_profile ADD COLUMN IF NOT EXISTS blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE admin_profile ADD COLUMN IF NOT EXISTS last_login TIMESTAMPTZ;

-- ATUALIZA FUNCAO RPC PARA USAR CAMPOS CORRETOS
CREATE OR REPLACE FUNCTION public.get_tenants_with_stats()
RETURNS TABLE (
    id UUID,
    user_id UUID,
    name VARCHAR,
    email VARCHAR,
    slug VARCHAR,
    created_at TIMESTAMPTZ,
    blocked BOOLEAN,
    plan_id UUID,
    plan_name VARCHAR,
    forms_count BIGINT,
    submissions_count BIGINT,
    last_login TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ap.id,
        ap.user_id,
        ap.name,
        ap.email,
        ap.slug,
        ap.created_at,
        COALESCE(ap.blocked, FALSE) as blocked,
        ap.plan_id,
        p.name as plan_name,
        COUNT(f.id) as forms_count,
        COUNT(fs.id) as submissions_count,
        ap.last_login
    FROM admin_profile ap
    LEFT JOIN plans p ON p.id = ap.plan_id
    LEFT JOIN forms f ON f.user_id = ap.user_id
    LEFT JOIN form_submissions fs ON fs.form_id = f.id
    GROUP BY ap.id, ap.user_id, ap.name, ap.email, ap.slug, ap.created_at, ap.blocked, ap.plan_id, p.name, ap.last_login
    ORDER BY ap.created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_tenants_with_stats() TO authenticated;