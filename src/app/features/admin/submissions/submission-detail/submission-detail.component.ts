import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { FormSubmission } from '@core/models';

@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen bg-surface">
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-4xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/admin/submissions" class="text-text-secondary hover:text-text-primary">←</a>
            <div>
              <h1 class="text-xl font-semibold text-text-primary" i18n="@@submissionDetail">
                Detalhe da Resposta
              </h1>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              (click)="markAsRead()"
              class="px-4 py-2 border border-border text-text-primary rounded-lg font-medium
                     hover:bg-surface transition-colors"
              i18n="@@markAsRead"
            >
              Marcar como lido
            </button>
            <button
              (click)="deleteSubmission()"
              class="px-4 py-2 border border-error text-error rounded-lg font-medium
                     hover:bg-error/10 transition-colors"
              i18n="@@delete"
            >
              Excluir
            </button>
          </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto p-6">
        @if (loading()) {
          <div class="bg-white rounded-xl border border-border p-8 animate-pulse">
            <div class="h-6 bg-surface rounded w-1/3 mb-4"></div>
            <div class="h-4 bg-surface rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-surface rounded w-1/4"></div>
          </div>
        } @else if (submission()) {
          <div class="bg-white rounded-xl border border-border p-6">
            <!-- Header -->
            <div class="border-b border-border pb-4 mb-6">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-bold text-text-primary">
                    {{ submission()?.template_title }}
                  </h2>
                  <p class="text-text-secondary mt-1">
                    Respondido por {{ submission()?.submitter_name || 'Anônimo' }}
                    @if (submission()?.submitter_email) {
                      ({{ submission()?.submitter_email }})
                    }
                  </p>
                </div>
                <span
                  class="px-3 py-1 text-sm rounded-full"
                  [class]="getStatusClass(submission()?.status || '')"
                >
                  {{ getStatusLabel(submission()?.status || '') }}
                </span>
              </div>
              <p class="text-sm text-text-secondary mt-2">
                {{ formatDate(submission()?.submitted_at || '') }}
              </p>
            </div>

            <!-- Answers -->
            <div class="space-y-6">
              <h3 class="text-lg font-semibold text-text-primary" i18n="@@answers">Respostas</h3>
              
              @for (entry of getAnswersEntries(); track entry.key) {
                <div class="border border-border rounded-lg p-4">
                  <div class="text-sm font-medium text-text-secondary mb-1">
                    {{ entry.key }}
                  </div>
                  <div class="text-text-primary">
                    @if (isArray(entry.value)) {
                      <ul class="list-disc list-inside">
                        @for (item of entry.value; track item) {
                          <li>{{ item }}</li>
                        }
                      </ul>
                    } @else {
                      {{ entry.value }}
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class SubmissionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);

  submission = signal<FormSubmission | null>(null);
  loading = signal(true);

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (id) {
      await this.loadSubmission(id);
    }
  }

  private async loadSubmission(id: string): Promise<void> {
    const { data } = await this.supabase.client
      .from('form_submissions')
      .select('*')
      .eq('id', id)
      .single();

    this.submission.set(data as FormSubmission);
    this.loading.set(false);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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

  getAnswersEntries(): { key: string; value: any }[] {
    const answers = this.submission()?.answers || {};
    return Object.entries(answers).map(([key, value]) => ({ key, value }));
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  async markAsRead(): Promise<void> {
    const id = this.submission()?.id;
    if (!id) return;

    await this.supabase.client.from('form_submissions').update({
      status: 'read',
    }).eq('id', id);

    this.submission.update((s) => s ? { ...s, status: 'read' } : s);
  }

  async deleteSubmission(): Promise<void> {
    const id = this.submission()?.id;
    if (!id) return;

    // TODO: Add confirmation dialog
    await this.supabase.client.from('form_submissions').delete().eq('id', id);
  }
}