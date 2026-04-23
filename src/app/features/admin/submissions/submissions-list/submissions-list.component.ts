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
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, PaginationComponent],
  template: `
    <div class="min-h-screen bg-surface">
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/admin" class="text-text-secondary hover:text-text-primary">←</a>
            <div>
              <h1 class="text-xl font-semibold text-text-primary" i18n="@@submissions">Respostas</h1>
              <p class="text-sm text-text-secondary" i18n="@@submissionsDesc">Visualize todas as respostas dos formulários</p>
            </div>
          </div>
          <button
            (click)="exportCsv()"
            class="px-4 py-2 border border-border text-text-primary rounded-lg font-medium
                   hover:bg-surface transition-colors"
            i18n="@@exportCsv"
          >
            Exportar CSV
          </button>
        </div>
      </header>

      <!-- Filters -->
      <div class="max-w-7xl mx-auto p-6">
        <div class="bg-white rounded-xl border border-border p-4 mb-6">
          <div class="flex flex-wrap gap-4">
            <div class="flex-1 min-w-[200px]">
              <input
                type="text"
                [(ngModel)]="filters.name"
                (ngModelChange)="loadSubmissions()"
                placeholder="Buscar por nome..."
                class="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <select
              [(ngModel)]="filters.status"
              (ngModelChange)="loadSubmissions()"
              class="px-4 py-2 border border-border rounded-lg bg-white"
            >
              <option value="">Todos os status</option>
              <option value="new">Novo</option>
              <option value="read">Lido</option>
              <option value="archived">Arquivado</option>
            </select>
          </div>
        </div>

        <!-- Submissions Table -->
        <div class="bg-white rounded-xl border border-border overflow-hidden">
          @if (loading()) {
            <div class="p-8 text-center">
              <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          } @else if (submissions().length === 0) {
            <div class="p-12 text-center">
              <div class="text-6xl mb-4">📬</div>
              <h2 class="text-xl font-semibold text-text-primary mb-2" i18n="@@noSubmissionsYet">
                Nenhuma resposta ainda
              </h2>
              <p class="text-text-secondary">
                As respostas dos formulários aparecerão aqui.
              </p>
            </div>
          } @else {
            <table class="w-full">
              <thead class="bg-surface">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@name">Nome</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@form">Formulário</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@date">Data</th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-text-secondary" i18n="@@status">Status</th>
                  <th class="px-6 py-3 text-right text-sm font-medium text-text-secondary" i18n="@@actions">Ações</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                @for (sub of submissions(); track sub.id) {
                  <tr class="hover:bg-surface">
                    <td class="px-6 py-4">
                      <div class="font-medium text-text-primary">{{ sub.submitter_name || 'Anônimo' }}</div>
                      @if (sub.submitter_email) {
                        <div class="text-sm text-text-secondary">{{ sub.submitter_email }}</div>
                      }
                    </td>
                    <td class="px-6 py-4 text-text-primary">{{ sub.template_title }}</td>
                    <td class="px-6 py-4 text-text-secondary text-sm">
                      {{ formatDate(sub.submitted_at) }}
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 text-xs rounded-full"
                        [class]="getStatusClass(sub.status ?? 'new')"
                      >
                        {{ getStatusLabel(sub.status ?? 'new') }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <a
                        [routerLink]="['/admin/submissions', sub.id]"
                        class="text-primary hover:underline"
                        i18n="@@view"
                      >
                        Ver
                      </a>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <!-- Pagination -->
            <app-pagination
              [currentPage]="currentPage()"
              [totalPages]="totalPages()"
              (pageChange)="onPageChange($event)"
            />
          }
        </div>
      </div>
    </div>
  `,
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
      query = query.ilike('submitter_name', `%${this.filters.name}%`);
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
      new: 'bg-primary/10 text-primary',
      read: 'bg-success/10 text-success',
      archived: 'bg-surface text-text-secondary',
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
