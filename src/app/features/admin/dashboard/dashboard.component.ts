import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeSelectorComponent } from '@shared/components/theme-selector/theme-selector.component';

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
  imports: [
    CommonModule, 
    RouterLink, 
    TranslateModule,
    LanguageSelectorComponent,
    ThemeSelectorComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  stats = signal<DashboardStats | null>(null);
  recentSubmissions = signal<RecentSubmission[]>([]);
  loading = signal(true);

  settingsLinks = [
    { path: '/admin/settings', icon: '👤', label: 'Perfil', desc: 'Nome, descrição e foto' },
    { path: '/admin/settings/appearance', icon: '🎨', label: 'Tema', desc: 'Cores e identidade visual' },
    { path: '/admin/settings/email', icon: '📧', label: 'E-mail', desc: 'Conexão Resend ou SMTP' },
    { path: '/admin/settings/whatsapp', icon: '💬', label: 'WhatsApp', desc: 'Mensagens e suporte' },
    { path: '/admin/settings/general', icon: '⚙️', label: 'Geral', desc: 'Idiomas e webhooks' },
  ];

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  getStatCards() {
    const s = this.stats();
    return [
      { label: 'Formulários', value: s?.totalForms || 0, icon: '📝', iconBg: 'bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400' },
      { label: 'Respostas', value: s?.totalSubmissions || 0, icon: '📬', iconBg: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' },
      { label: 'Este Mês', value: s?.submissionsThisMonth || 0, icon: '📅', iconBg: 'bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400' },
      { label: 'Mês Passado', value: s?.submissionsLastMonth || 0, icon: '📉', iconBg: 'bg-rose-50 text-rose-500 dark:bg-rose-900/30 dark:text-rose-400' },
    ];
  }

  private async loadData(): Promise<void> {
    try {
      const user = this.auth.currentUser();
      if (!user) return;

      const { count: formsCount } = await this.supabase.client
        .from('form_templates')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const { count: submissionsCount } = await this.supabase.client
        .from('form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: thisMonthCount } = await this.supabase.client
        .from('form_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('submitted_at', startOfMonth.toISOString());

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
    });
  }
}
