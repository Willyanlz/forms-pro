import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { FormSubmission } from '@core/models';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeSelectorComponent } from '@shared/components/theme-selector/theme-selector.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-submissions-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    PaginationComponent,
    LanguageSelectorComponent,
    ThemeSelectorComponent
  ],
  templateUrl: './submissions-list.component.html',
  styleUrl: './submissions-list.component.scss'
})
export class SubmissionsListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private translate = inject(TranslateService);

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
      new: this.translate.instant('submissions.status.new'),
      read: this.translate.instant('submissions.status.read'),
      archived: this.translate.instant('submissions.status.archived'),
    };
    return labels[status] || status;
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadSubmissions();
  }

  exportCsv(): void {
    const data = this.submissions().map(sub => ({
      [this.translate.instant('common.name')]: sub.submitter_name || this.translate.instant('common.anonymous'),
      [this.translate.instant('common.email')]: sub.submitter_email || '-',
      [this.translate.instant('common.form')]: sub.template_title || '-',
      [this.translate.instant('common.date')]: this.formatDate(sub.submitted_at),
      [this.translate.instant('common.status')]: this.getStatusLabel(sub.status ?? 'new')
    }));

    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => Object.values(row).map(v => `"${v}"`).join(','));
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    this.downloadFile(blob, 'submissoes.csv');
  }

  exportXlsx(): void {
    const data = this.submissions().map(sub => ({
      [this.translate.instant('common.name')]: sub.submitter_name || this.translate.instant('common.anonymous'),
      [this.translate.instant('common.email')]: sub.submitter_email || '-',
      [this.translate.instant('common.form')]: sub.template_title || '-',
      [this.translate.instant('common.date')]: this.formatDate(sub.submitted_at),
      [this.translate.instant('common.status')]: this.getStatusLabel(sub.status ?? 'new')
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissões');
    XLSX.writeFile(workbook, 'submissoes.xlsx');
  }

  exportPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(this.translate.instant('submissions.export.pdfTitle'), 14, 22);
    doc.setFontSize(10);

    let y = 40;
    const headers = [
      this.translate.instant('common.name'),
      this.translate.instant('common.email'),
      this.translate.instant('common.form'),
      this.translate.instant('common.date'),
      this.translate.instant('common.status')
    ];

    doc.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
      doc.text(header, 14 + (i * 38), y);
    });

    y += 10;
    doc.setFont('helvetica', 'normal');

    this.submissions().forEach(sub => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(sub.submitter_name || this.translate.instant('common.anonymous'), 14, y);
      doc.text(sub.submitter_email || '-', 52, y);
      doc.text(sub.template_title || '-', 90, y);
      doc.text(this.formatDate(sub.submitted_at), 128, y);
      doc.text(this.getStatusLabel(sub.status ?? 'new'), 166, y);

      y += 8;
    });

    doc.save('submissoes.pdf');
  }

  private downloadFile(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
