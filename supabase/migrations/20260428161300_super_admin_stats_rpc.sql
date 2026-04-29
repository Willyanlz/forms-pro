-- FUNCAO RPC PARA RETORNAR ESTATISTICAS GLOBAIS DO DASHBOARD SUPER ADMIN
CREATE OR REPLACE FUNCTION public.get_super_admin_stats()
RETURNS JSONB AS $$
DECLARE
    total_tenants INTEGER;
    active_tenants INTEGER;
    new_last_7_days INTEGER;
    new_last_30_days INTEGER;
    total_forms INTEGER;
    total_submissions INTEGER;
BEGIN
    -- Total de tenants cadastrados
    SELECT COUNT(*) INTO total_tenants FROM admin_profile;
    
    -- Tenants ativos
    SELECT COUNT(*) INTO active_tenants FROM admin_profile WHERE blocked = FALSE;
    
    -- Novos cadastros ultimos 7 dias
    SELECT COUNT(*) INTO new_last_7_days FROM admin_profile WHERE created_at >= NOW() - INTERVAL '7 days';
    
    -- Novos cadastros ultimos 30 dias
    SELECT COUNT(*) INTO new_last_30_days FROM admin_profile WHERE created_at >= NOW() - INTERVAL '30 days';
    
    -- Total de formularios na plataforma
    SELECT COUNT(*) INTO total_forms FROM forms;
    
    -- Total de submissoes recebidas
    SELECT COUNT(*) INTO total_submissions FROM form_submissions;

    RETURN jsonb_build_object(
        'total_tenants', total_tenants,
        'active_tenants', active_tenants,
        'new_last_7_days', new_last_7_days,
        'new_last_30_days', new_last_30_days,
        'total_forms', total_forms,
        'total_submissions', total_submissions
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_super_admin_stats() TO authenticated;

-- FUNCAO PARA BUSCAR TENANTS COM CONTADORES
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
        ap.blocked,
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