import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { FormSubmission } from '@core/models';

@Component({
  selector: 'app-submission-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './submission-detail.component.html',
  styleUrls: ['./submission-detail.component.scss']
})
export class SubmissionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private translate = inject(TranslateService);

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
      new: this.translate.instant('submissions.status.new'),
      read: this.translate.instant('submissions.status.read'),
      archived: this.translate.instant('submissions.status.archived'),
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