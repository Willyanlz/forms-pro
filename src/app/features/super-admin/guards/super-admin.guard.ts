import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {

    constructor(
        private supabase: SupabaseService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> {
        return from(this.supabase.auth.getUser()).pipe(
            switchMap(async ({ data: { user } }) => {
                if (!user) {
                    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                    return false;
                }

                // VERIFICA SE USUARIO TEM ROLE SUPER ADMIN NO BANCO
                const { data, error } = await this.supabase.client
                    .rpc('is_super_admin');

                if (error || !data) {
                    console.warn('⚠️ Acesso negado ao Super Admin:', user.email);
                    this.router.navigate(['/admin']);
                    return false;
                }

                return true;
            }),
            catchError(() => {
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }
}