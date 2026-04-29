import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';
import { SupabaseService } from '@core/services/supabase.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-surface px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-text-primary">Labs Will</h1>
          <p class="text-text-secondary mt-2" i18n="@@loginTitle">Entrar na sua conta</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-xl shadow-sm border border-border">
          @if (error()) {
            <div class="mb-4 p-4 bg-error/10 border border-error rounded-lg text-error text-sm">
              {{ error() }}
            </div>
          }

          <div class="mb-6">
            <label for="email" class="block text-sm font-medium text-text-primary mb-2" i18n="@@email">
              Email
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              required
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                     outline-none transition-colors"
              [placeholder]="'email@example.com'"
            />
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-text-primary mb-2" i18n="@@password">
              Senha
            </label>
            <div class="relative">
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                [(ngModel)]="password"
                name="password"
                required
                class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                       outline-none transition-colors pr-12"
              />
              <button
                type="button"
                (click)="showPassword.set(!showPassword())"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                {{ showPassword() ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <button
            type="submit"
            [disabled]="loading()"
            class="w-full py-3 bg-primary text-white rounded-lg font-semibold
                   hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (loading()) {
              <span class="inline-flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span i18n="@@loading">Carregando...</span>
              </span>
            } @else {
              <span i18n="@@login">Entrar</span>
            }
          </button>
        </form>

        <p class="text-center text-text-secondary text-sm mt-6">
          {{ '© 2026 Labs Will' }}
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private supabase = inject(SupabaseService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  password = '';
  loading = signal(false);
  showPassword = signal(false);
  error = signal('');

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.error.set('Por favor, preencha email e senha');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.auth.signIn(this.email, this.password);

      // VERIFICA SE USUARIO PRECISA ALTERAR SENHA NO PRIMEIRO ACESSO
      const { data: needsChange } = await this.supabase.client.rpc('needs_password_change');

      if (needsChange) {
        await this.router.navigate(['/first-access']);
        return;
      }

      // VERIFICA SE É SUPER ADMIN E REDIRECIONA AUTOMATICAMENTE
      const { data: isSuperAdmin } = await this.supabase.client.rpc('is_super_admin');

      if (isSuperAdmin) {
        await this.router.navigate(['/super-admin']);
      } else {
        await this.router.navigate(['/admin']);
      }
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao fazer login');
    } finally {
      this.loading.set(false);
    }
  }
}
