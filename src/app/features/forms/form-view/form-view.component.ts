import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective } from 'ngx-mask';
import { SupabaseService } from '@core/services/supabase.service';
import { I18nService } from '@core/services/i18n.service';
import { ToastService } from '@core/services/toast.service';
import { FormTemplate, FormSection, FormField } from '@core/models';

interface FormData {
  template: FormTemplate | null;
  sections: FormSection[];
  fields: FormField[];
}

@Component({
  selector: 'app-form-view',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, NgxMaskDirective, RouterLink],
  template: `
    <div class="min-h-screen bg-surface">
      <!-- Header -->
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-3xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/forms" class="text-text-secondary hover:text-text-primary">←</a>
            <h1 class="text-xl font-semibold text-text-primary">
              {{ getTitle() }}
            </h1>
          </div>
          <div class="text-sm text-text-secondary">
            {{ 'Página ' + currentSectionIndex() + ' de ' + totalSections() }}
          </div>
        </div>
      </header>

      <!-- Progress Bar -->
      <div class="bg-white border-b border-border px-6 py-2">
        <div class="max-w-3xl mx-auto">
          <div class="h-2 bg-surface rounded-full overflow-hidden">
            <div
              class="h-full bg-primary transition-all duration-300"
              [style.width.%]="progressPercent()"
            ></div>
          </div>
        </div>
      </div>

      <!-- Form Content -->
      <div class="max-w-3xl mx-auto p-6">
        @if (loading()) {
          <div class="bg-white p-8 rounded-xl border border-border animate-pulse">
            <div class="h-8 bg-surface rounded w-1/2 mb-6"></div>
            <div class="h-4 bg-surface rounded w-full mb-4"></div>
            <div class="h-4 bg-surface rounded w-3/4 mb-4"></div>
            <div class="h-12 bg-surface rounded w-full"></div>
          </div>
        } @else if (error()) {
          <div class="bg-white p-8 rounded-xl border border-border text-center">
            <div class="text-6xl mb-4">😕</div>
            <h2 class="text-xl font-semibold text-text-primary mb-2">Erro ao carregar formulário</h2>
            <p class="text-text-secondary">{{ error() }}</p>
            <a routerLink="/forms" class="inline-block mt-4 text-primary hover:underline">
              Voltar para lista de formulários
            </a>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="bg-white p-8 rounded-xl border border-border">
            <!-- Section Title -->
            <h2 class="text-2xl font-bold text-text-primary mb-2">
              {{ getSectionTitle() }}
            </h2>
            @if (getSectionDescription()) {
              <p class="text-text-secondary mb-6">{{ getSectionDescription() }}</p>
            }

            <!-- Fields -->
            <div class="space-y-6">
              <div *ngFor="let field of currentFields(); trackBy: trackFieldById">
                <label class="block text-sm font-medium text-text-primary mb-2">
                  {{ getFieldLabel(field) }}
                  <span *ngIf="field.is_required" class="text-error">*</span>
                </label>

                  <ng-container [ngSwitch]="field.field_type">
                    <input
                      *ngSwitchCase="'text'"
                      type="text"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <input
                      *ngSwitchCase="'email'"
                      type="email"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <input
                      *ngSwitchCase="'phone'"
                      type="text"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      mask="(00) 00000-0000"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <input
                      *ngSwitchCase="'cpf'"
                      type="text"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      mask="000.000.000-00"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <input
                      *ngSwitchCase="'cnpj'"
                      type="text"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      mask="00.000.000/0000-00"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <input
                      *ngSwitchCase="'cep'"
                      type="text"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      mask="00000-000"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <input
                      *ngSwitchCase="'date'"
                      type="date"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <input
                      *ngSwitchCase="'number'"
                      type="number"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      [min]="field.min_value"
                      [max]="field.max_value"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                    <textarea
                      *ngSwitchCase="'textarea'"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      [minlength]="field.min_length"
                      [maxlength]="field.max_length"
                      rows="4"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors resize-none"
                    ></textarea>
                    <select
                      *ngSwitchCase="'select'"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors bg-white"
                    >
                      <option value="" i18n="@@selectOption">Selecione...</option>
                      @for (opt of getFieldOptions(field); track opt.value) {
                        <option [value]="opt.value">{{ opt.label }}</option>
                      }
                    </select>
                    <div *ngSwitchCase="'radio'" class="space-y-2">
                      @for (opt of getFieldOptions(field); track opt.value) {
                        <label class="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            [value]="opt.value"
                            [(ngModel)]="formAnswers[field.id]"
                            [name]="'field_' + field.id"
                            [required]="field.is_required"
                            class="w-4 h-4 text-primary border-border focus:ring-primary"
                          />
                          <span class="text-text-primary">{{ opt.label }}</span>
                        </label>
                      }
                    </div>
                    <div *ngSwitchCase="'checkbox'" class="space-y-2">
                      @for (opt of getFieldOptions(field); track opt.value) {
                        <label class="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            [value]="opt.value"
                            [checked]="isCheckboxChecked(field.id, opt.value)"
                            (change)="toggleCheckbox(field.id, opt.value)"
                            class="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                          />
                          <span class="text-text-primary">{{ opt.label }}</span>
                        </label>
                      }
                    </div>
                    <label *ngSwitchCase="'toggle'" class="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        [(ngModel)]="formAnswers[field.id]"
                        [name]="'field_' + field.id"
                        class="w-12 h-6 rounded-full bg-surface border-border text-primary
                               focus:ring-primary relative transition-colors"
                      />
                      <span class="text-text-primary">{{ getFieldPlaceholder(field) }}</span>
                    </label>
                    <input
                      *ngSwitchDefault
                      type="text"
                      [(ngModel)]="formAnswers[field.id]"
                      [name]="'field_' + field.id"
                      [placeholder]="getFieldPlaceholder(field)"
                      [required]="field.is_required"
                      class="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary
                             focus:border-primary outline-none transition-colors"
                    />
                  </ng-container>

                <p *ngIf="field.helper_text" class="text-xs text-text-secondary mt-1">
                  {{ getFieldHelper(field) }}
                </p>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="mt-8 flex justify-between">
              @if (currentSectionIndex() > 1) {
                <button
                  type="button"
                  (click)="previousSection()"
                  class="px-6 py-3 border border-border text-text-primary rounded-lg font-medium
                         hover:bg-surface transition-colors"
                  i18n="@@previous"
                >
                  Anterior
                </button>
              } @else {
                <div></div>
              }

              @if (currentSectionIndex() < totalSections()) {
                <button
                  type="button"
                  (click)="nextSection()"
                  class="px-6 py-3 bg-primary text-white rounded-lg font-medium
                         hover:bg-primary-dark transition-colors"
                  i18n="@@next"
                >
                  Próximo
                </button>
              } @else {
                <button
                  type="submit"
                  [disabled]="submitting()"
                  class="px-6 py-3 bg-primary text-white rounded-lg font-medium
                         hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  @if (submitting()) {
                    <span i18n="@@sending">Enviando...</span>
                  } @else {
                    <span i18n="@@submit">Enviar</span>
                  }
                </button>
              }
            </div>
          </form>
        }
      </div>
    </div>
  `,
})
export class FormViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  formData = signal<FormData>({ template: null, sections: [], fields: [] });
  currentSectionIndex = signal(1);
  formAnswers: Record<string, any> = {};
  checkboxAnswers: Record<string, string[]> = {};

  loading = signal(true);
  submitting = signal(false);
  error = signal('');

  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      await this.loadForm(slug);
    }
  }

  private async loadForm(slug: string): Promise<void> {
    try {
      // Load template
      const { data: template, error: templateError } = await this.supabase.client
        .from('form_templates')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

      if (templateError || !template) {
        this.error.set('Formulário não encontrado');
        this.loading.set(false);
        return;
      }

      // Load sections
      const { data: sections } = await this.supabase.client
        .from('form_sections')
        .select('*')
        .eq('template_id', template.id)
        .order('display_order', { ascending: true });

      // Load fields
      const { data: fields } = await this.supabase.client
        .from('form_fields')
        .select('*')
        .eq('template_id', template.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      this.formData.set({
        template: template as FormTemplate,
        sections: (sections as FormSection[]) || [],
        fields: (fields as FormField[]) || [],
      });
    } catch (err: any) {
      this.error.set(err.message || 'Erro ao carregar formulário');
    } finally {
      this.loading.set(false);
    }
  }

  getTitle(): string {
    const template = this.formData().template;
    if (!template) return '';
    const lang = this.i18n.currentLang();
    return (template.title as any)?.[lang] || (template.title as any)?.['pt'] || '';
  }

  getSectionTitle(): string {
    const sections = this.formData().sections;
    const index = this.currentSectionIndex() - 1;
    if (!sections[index]) return '';
    const lang = this.i18n.currentLang();
    return (sections[index].title as any)?.[lang] || (sections[index].title as any)?.['pt'] || '';
  }

  getSectionDescription(): string {
    const sections = this.formData().sections;
    const index = this.currentSectionIndex() - 1;
    if (!sections[index]) return '';
    const lang = this.i18n.currentLang();
    return (sections[index].description as any)?.[lang] || (sections[index].description as any)?.['pt'] || '';
  }

  currentFields(): FormField[] {
    const sections = this.formData().sections;
    const fields = this.formData().fields;
    const sectionIndex = this.currentSectionIndex() - 1;

    if (!sections[sectionIndex]) return [];

    const sectionId = sections[sectionIndex].id;
    return fields.filter((f) => f.section_id === sectionId);
  }

  totalSections(): number {
    return this.formData().sections.length;
  }

  progressPercent(): number {
    return (this.currentSectionIndex() / this.totalSections()) * 100;
  }

  getFieldLabel(field: FormField): string {
    const lang = this.i18n.currentLang();
    return (field.label as any)?.[lang] || (field.label as any)?.['pt'] || '';
  }

  getFieldPlaceholder(field: FormField): string {
    const lang = this.i18n.currentLang();
    return (field.placeholder as any)?.[lang] || (field.placeholder as any)?.['pt'] || '';
  }

  getFieldHelper(field: FormField): string {
    const lang = this.i18n.currentLang();
    return (field.helper_text as any)?.[lang] || (field.helper_text as any)?.['pt'] || '';
  }

  getFieldOptions(field: FormField): { label: string; value: string }[] {
    if (!field.options) return [];
    try {
      return field.options as { label: string; value: string }[];
    } catch {
      return [];
    }
  }

  trackFieldById(_index: number, field: FormField): string {
    return field.id;
  }

  isCheckboxChecked(fieldId: string, value: string): boolean {
    return this.checkboxAnswers[fieldId]?.includes(value) || false;
  }

  toggleCheckbox(fieldId: string, value: string): void {
    if (!this.checkboxAnswers[fieldId]) {
      this.checkboxAnswers[fieldId] = [];
    }
    const index = this.checkboxAnswers[fieldId].indexOf(value);
    if (index > -1) {
      this.checkboxAnswers[fieldId].splice(index, 1);
    } else {
      this.checkboxAnswers[fieldId].push(value);
    }
  }

  nextSection(): void {
    if (this.currentSectionIndex() < this.totalSections()) {
      this.currentSectionIndex.update((v) => v + 1);
    }
  }

  previousSection(): void {
    if (this.currentSectionIndex() > 1) {
      this.currentSectionIndex.update((v) => v - 1);
    }
  }

  async onSubmit(): Promise<void> {
    this.submitting.set(true);

    try {
      const template = this.formData().template;
      if (!template) return;

      // Prepare answers
      const answers: Record<string, any> = { ...this.formAnswers };
      for (const fieldId of Object.keys(this.checkboxAnswers)) {
        answers[fieldId] = this.checkboxAnswers[fieldId];
      }

      // Get submitter info
      const submitterEmail = answers['email'] || answers['submitter_email'] || '';
      const submitterName = answers['name'] || answers['submitter_name'] || '';

      // Save submission
      const { error: submitError } = await this.supabase.client.from('form_submissions').insert({
        template_id: template.id,
        template_title: this.getTitle(),
        submitter_name: submitterName,
        submitter_email: submitterEmail,
        answers: answers,
      });

      if (submitError) throw submitError;

      this.toast.success('Formulário enviado com sucesso!');

      // Redirect to WhatsApp if configured
      const profile = await this.supabase.client
        .from('admin_profile')
        .select('whatsapp_number')
        .limit(1)
        .single();

      if (profile.data?.whatsapp_number) {
        const phone = profile.data.whatsapp_number.replace(/\D/g, '');
        window.location.href = `https://wa.me/${phone}`;
      } else {
        this.router.navigate(['/forms']);
      }
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao enviar formulário');
    } finally {
      this.submitting.set(false);
    }
  }
}
