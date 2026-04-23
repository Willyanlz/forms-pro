import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-surface px-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-text-primary">Labs Will</h1>
          <p class="text-text-secondary mt-2" i18n="@@setPasswordTitle">Definir nova senha</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-xl shadow-sm border border-border">
          @if (error()) {
            <div class="mb-4 p-4 bg-error/10 border border-error rounded-lg text-error text-sm">
              {{ error() }}
            </div>
          }

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-text-primary mb-2" i18n="@@newPassword">
              Nova Senha
            </label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              minlength="8"
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                     outline-none transition-colors"
            />
            <p class="text-xs text-text-secondary mt-1" i18n="@@passwordRequirements">
              Mínimo 8 caracteres, 1 maiúscula, 1 número
            </p>
          </div>

          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-medium text-text-primary mb-2" i18n="@@confirmPassword">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              required
              class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary
                     outline-none transition-colors"
            />
          </div>

          <!-- Password Strength -->
          <div class="mb-6">
            <div class="flex gap-1 mb-2">
              @for (item of [1,2,3,4]; track item) {
                <div 
                  class="h-1 flex-1 rounded-full transition-colors"
                  [class]="getStrengthColor(item)"
                ></div>
              }
            </div>
            <p class="text-xs text-text-secondary">{{ getStrengthText() }}</p>
          </div>

          <button
            type="submit"
            [disabled]="loading() || !isValid()"
            class="w-full py-3 bg-primary text-white rounded-lg font-semibold
                   hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (loading()) {
              <span i18n="@@loading">Carregando...</span>
            } @else {
              <span i18n="@@savePassword">Salvar Senha</span>
            }
          </button>
        </form>
      </div>
    </div>
  `,
})
export class SetPasswordComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  password = '';
  confirmPassword = '';
  loading = signal(false);
  error = signal('');

  isValid(): boolean {
    if (!this.password || !this.confirmPassword) return false;
    if (this.password !== this.confirmPassword) return false;
    if (this.password.length < 8) return false;
    return /[A-Z]/.test(this.password) && /[0-9]/.test(this.password);
  }

  getStrength(): number {
    let strength = 0;
    if (this.password.length >= 8) strength++;
    if (/[A-Z]/.test(this.password)) strength++;
    if (/[0-9]/.test(this.password)) strength++;
    if (/[^A-Za-z0-9]/.test(this.password)) strength++;
    return strength;
  }

  getStrengthColor(level: number): string {
    const strength = this.getStrength();
    if (strength >= level) {
      if (strength <= 1) return 'bg-error';
      if (strength <= 2) return 'bg-warning';
      return 'bg-success';
    }
    return 'bg-surface';
  }

  getStrengthText(): string {
    const strength = this.getStrength();
    const texts = ['Muito fraca', 'Fraca', 'Moderada', 'Forte', 'Muito forte'];
    return texts[strength] || 'Digite uma senha';
  }

  async onSubmit(): Promise<void> {
    if (!this.isValid()) {
      this.error.set('Preencha todos os campos corretamente');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      await this.auth.setPassword(this.password);
      await this.router.navigate(['/admin']);
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao definir senha');
    } finally {
      this.loading.set(false);
    }
  }
}
