import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { FormSubmission } from '@core/models';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
  selector: 'app-submissions-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    TranslateModule, 
    PaginationComponent
  ],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.scss'
})
export class SubmissionsListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  submissions = signal<FormSubmission[]>([]);
  loading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);

  filters = {
    name: '',
    status: '',
  };

  async ngOnInit(): Promise<void> {
    await this.loadSubmissions();
  }

  async loadSubmissions(): Promise<void> {
    this.loading.set(true);
    const user = this.auth.currentUser();
    if (!user) return;

    let query = this.supabase.client
      .from('form_submissions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('submitted_at', { ascending: false })
      .range((this.currentPage() - 1) * 10, this.currentPage() * 10 - 1);

    if (this.filters.name) {
      query = query.or(`submitter_name.ilike.%${this.filters.name}%,submitter_email.ilike.%${this.filters.name}%`);
    }
    if (this.filters.status) {
      query = query.eq('status', this.filters.status);
    }

    const { data, count } = await query;

    this.submissions.set((data as FormSubmission[]) || []);
    this.totalPages.set(Math.ceil((count || 0) / 10));
    this.loading.set(false);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      new: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      read: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      archived: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500',
    };
    return classes[status] || classes['new'];
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      new: 'Novo',
      read: 'Lido',
      archived: 'Arquivado',
    };
    return labels[status] || status;
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadSubmissions();
  }

  exportCsv(): void {
    // TODO: Implement CSV export
  }
}
