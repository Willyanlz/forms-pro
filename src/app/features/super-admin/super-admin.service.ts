import { Injectable } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { from, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SuperAdminService {

    constructor(private supabase: SupabaseService) { }

    /**
     * Verifica se o usuário logado é Super Admin
     */
    isSuperAdmin(): Observable<boolean> {
        return from(this.supabase.client.rpc('is_super_admin')).pipe(
            map(result => result.data ?? false)
        );
    }

    /**
     * Busca todos os tenants da plataforma com estatisticas
     */
    getAllTenants() {
        return from(this.supabase.client
            .rpc('get_tenants_with_stats')
        );
    }

    /**
     * Busca métricas globais para dashboard
     */
    getGlobalStats() {
        return from(this.supabase.client.rpc('get_super_admin_stats'));
    }

    /**
     * Busca detalhes de um tenant especifico
     */
    getTenantById(tenantId: string) {
        return from(this.supabase.client
            .from('admin_profile')
            .select('*, plan:plans(*)')
            .eq('id', tenantId)
            .single()
        );
    }

    /**
     * Busca formularios de um tenant
     */
    getTenantForms(userId: string) {
        return from(this.supabase.client
            .from('user_forms')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        );
    }

    /**
     * Busca submissoes de um tenant
     */
    getTenantSubmissions(userId: string) {
        return from(this.supabase.client
            .from('form_responses')
            .select('*, form:user_forms(title)')
            .eq('form.user_id', userId)
            .order('created_at', { ascending: false })
            .limit(50)
        );
    }

    /**
     * Bloqueia / Desbloqueia um tenant
     */
    toggleTenantBlock(tenantId: string, blocked: boolean) {
        return from(this.supabase.client
            .from('admin_profile')
            .update({ blocked })
            .eq('id', tenantId)
        );
    }

    /**
     * Gera token de impersonacao
     */
    generateImpersonateToken(userId: string) {
        return from(this.supabase.client
            .rpc('generate_impersonate_token', { user_id: userId })
        );
    }

    /**
     * Cria um novo assinante (Tenant)
     */
    createTenant(email: string, password: string, name: string, company: string, phone: string) {
        return from(this.supabase.client
            .rpc('create_new_tenant', {
                tenant_email: email,
                tenant_password: password,
                tenant_name: name,
                tenant_company: company,
                tenant_phone: phone
            })
        );
    }
}
