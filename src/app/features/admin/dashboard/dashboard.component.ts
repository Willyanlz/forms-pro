import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

interface DashboardStats {
  totalForms: number;
  totalSubmissions: number;
  submissionsThisMonth: number;
  submissionsLastMonth: number;
}

interface RecentSubmission {
  id: string;
  template_title: string;
  submitter_name: string;
  submitted_at: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen bg-surface">
      <!-- Admin Header -->
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-text-primary" i18n="@@dashboard">Dashboard</h1>
            <p class="text-text-secondary text-sm" i18n="@@dashboardDesc">Visão geral do seu sistema</p>
          </div>
          <div class="flex items-center gap-4">
            <a
              routerLink="/admin/form-builder"
              class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              i18n="@@newForm"
            >
              + Novo Formulário
            </a>
          </div>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-xl border border-border">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-primary/10 rounded-lg">📝</div>
              <div>
                <p class="text-text-secondary text-sm" i18n="@@totalForms">Total de Formulários</p>
                <p class="text-2xl font-bold text-text-primary">{{ stats()?.totalForms || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-border">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-success/10 rounded-lg">📬</div>
              <div>
                <p class="text-text-secondary text-sm" i18n="@@totalSubmissions">Total de Respostas</p>
                <p class="text-2xl font-bold text-text-primary">{{ stats()?.totalSubmissions || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-border">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-warning/10 rounded-lg">📅</div>
              <div>
                <p class="text-text-secondary text-sm" i18n="@@thisMonth">Este Mês</p>
                <p class="text-2xl font-bold text-text-primary">{{ stats()?.submissionsThisMonth || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl border border-border">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-error/10 rounded-lg">📉</div>
              <div>
                <p class="text-text-secondary text-sm" i18n="@@lastMonth">Mês Passado</p>
                <p class="text-2xl font-bold text-text-primary">{{ stats()?.submissionsLastMonth || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Shortcuts -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-lg font-semibold text-text-primary">Configuracoes</h2>
              <p class="text-sm text-text-secondary">
                Acesse rapidamente tema, perfil, email, WhatsApp e configuracoes gerais.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <a
              routerLink="/admin/settings"
              class="bg-white p-5 rounded-xl border border-border hover:border-primary hover:shadow-sm transition-all"
            >
              <div class="text-2xl mb-3">👤</div>
              <div class="font-medium text-text-primary">Perfil</div>
              <div class="text-sm text-text-secondary mt-1">Nome, descricao e foto.</div>
            </a>

            <a
              routerLink="/admin/settings/appearance"
              class="bg-white p-5 rounded-xl border border-border hover:border-primary hover:shadow-sm transition-all"
            >
              <div class="text-2xl mb-3">🎨</div>
              <div class="font-medium text-text-primary">Tema</div>
              <div class="text-sm text-text-secondary mt-1">Cores primarias e visual do sistema.</div>
            </a>

            <a
              routerLink="/admin/settings/email"
              class="bg-white p-5 rounded-xl border border-border hover:border-primary hover:shadow-sm transition-all"
            >
              <div class="text-2xl mb-3">📧</div>
              <div class="font-medium text-text-primary">Email</div>
              <div class="text-sm text-text-secondary mt-1">Resend, SMTP ou nenhum.</div>
            </a>

            <a
              routerLink="/admin/settings/whatsapp"
              class="bg-white p-5 rounded-xl border border-border hover:border-primary hover:shadow-sm transition-all"
            >
              <div class="text-2xl mb-3">💬</div>
              <div class="font-medium text-text-primary">WhatsApp</div>
              <div class="text-sm text-text-secondary mt-1">Numero, mensagem padrao e preview.</div>
            </a>

            <a
              routerLink="/admin/settings/general"
              class="bg-white p-5 rounded-xl border border-border hover:border-primary hover:shadow-sm transition-all"
            >
              <div class="text-2xl mb-3">⚙️</div>
              <div class="font-medium text-text-primary">Geral</div>
              <div class="text-sm text-text-secondary mt-1">Idiomas, webhook e defaults.</div>
            </a>
          </div>
        </div>

        <!-- Recent Submissions -->
        <div class="bg-white rounded-xl border border-border">
          <div class="px-6 py-4 border-b border-border">
            <h2 class="text-lg font-semibold text-text-primary" i18n="@@recentSubmissions">
              Respostas Recentes
            </h2>
          </div>
          <div class="divide-y divide-border">
            @if (loading()) {
              @for (item of [1,2,3,4,5]; track item) {
                <div class="px-6 py-4 flex items-center gap-4">
                  <div class="w-10 h-10 bg-surface rounded-full animate-pulse"></div>
                  <div class="flex-1">
                    <div class="h-4 bg-surface rounded w-48 mb-2"></div>
                    <div class="h-3 bg-surface rounded w-32"></div>
                  </div>
                </div>
              }
            } @else if (recentSubmissions().length === 0) {
              <div class="px-6 py-12 text-center">
                <p class="text-text-secondary" i18n="@@noSubmissions">Nenhuma resposta ainda</p>
              </div>
            } @else {
              @for (submission of recentSubmissions(); track submission.id) {
                <a
                  [routerLink]="['/admin/submissions', submission.id]"
                  class="px-6 py-4 flex items-center gap-4 hover:bg-surface transition-colors"
                >
                  <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {{ submission.submitter_name.charAt(0) || '?' }}
                  </div>
                  <div class="flex-1">
                    <p class="font-medium text-text-primary">{{ submission.submitter_name || 'Anônimo' }}</p>
                    <p class="text-sm text-text-secondary">{{ submission.template_title }}</p>
                  </div>
                  <div class="text-right">
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      [class]="getStatusClass(submission.status)"
                    >
                      {{ submission.status }}
                    </span>
                    <p class="text-xs text-text-secondary mt-1">
                      {{ formatDate(submission.submitted_at) }}
                    </p>
                  </div>
                </a>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  stats = signal<DashboardStats | null>(null);
  recentSubmissions = signal<RecentSubmission[]>([]);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  private async loadData(): Promise<void> {
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      // Load forms count
      const { count: formsCount } = await this.supabase.client
        .from('form_templates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load submissions count
      const { count: submissionsCount } = await this.supabase.client
        .from('form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load this month submissions
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: thisMonthCount } = await this.supabase.client
        .from('form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('submitted_at', startOfMonth.toISOString());

      // Load recent submissions
      const { data: recent } = await this.supabase.client
        .from('form_submissions')
        .select('id, template_title, submitter_name, submitted_at, status')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(5);

      this.stats.set({
        totalForms: formsCount || 0,
        totalSubmissions: submissionsCount || 0,
        submissionsThisMonth: thisMonthCount || 0,
        submissionsLastMonth: 0,
      });

      this.recentSubmissions.set((recent as RecentSubmission[]) || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      this.loading.set(false);
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      new: 'bg-primary/10 text-primary',
      read: 'bg-success/10 text-success',
      archived: 'bg-text-secondary/10 text-text-secondary',
    };
    return classes[status] || classes['new'];
  }
}
