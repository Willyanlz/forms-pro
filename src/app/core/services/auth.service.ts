import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => !!this.currentUser());
  isLoading = signal(true);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly router: Router
  ) {
    // Recuperar sessao do localStorage no inicio
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('auth_user');
      }
    }

    this.supabaseService.auth.onAuthStateChange((_event, session) => {
      this.currentUser.set(session?.user ?? null);
      this.isLoading.set(false);

      // Persistir sessao no localStorage para nao perder login
      if (session?.user) {
        localStorage.setItem('auth_user', JSON.stringify(session.user));
        localStorage.setItem('auth_session_expires', session.expires_at?.toString() || '');
      } else {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_session_expires');
      }
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabaseService.auth.signOut();
    if (error) throw error;
    await this.router.navigate(['/login']);
  }

  async setPassword(password: string) {
    const { data, error } = await this.supabaseService.auth.updateUser({
      password,
    });
    if (error) throw error;
    return data;
  }

  async getCurrentSession() {
    const { data, error } = await this.supabaseService.auth.getSession();
    if (error) throw error;
    return data.session;
  }
}
