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
     * Busca todos os tenants da plataforma
     */
    getAllTenants() {
        return from(this.supabase.client
            .from('admin_profile')
            .select('*, plan:plans(*)')
            .order('created_at', { ascending: false })
        );
    }

    /**
     * Busca métricas globais para dashboard
     */
    getGlobalStats() {
        return from(this.supabase.client.rpc('get_super_admin_stats'));
    }
}