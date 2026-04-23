import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { AuthService } from '@core/services/auth.service';
import { I18nService } from '@core/services/i18n.service';
import { ToastService } from '@core/services/toast.service';
import { FormTemplate, FormSection, FormField, FieldType } from '@core/models';

interface FormEditorState {
  template: FormTemplate | null;
  sections: FormSection[];
  fields: FormField[];
  selectedSectionId: string | null;
  selectedFieldId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

@Component({
  selector: 'app-form-builder-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule, DragDropModule],
  template: `
    <div class="min-h-screen bg-surface flex flex-col">
      <!-- Header -->
      <header class="bg-white border-b border-border px-6 py-4">
        <div class="max-w-full mx-auto flex items-center justify-between">
          <div class="flex items-center gap-4">
            <a routerLink="/admin/form-builder" class="text-text-secondary hover:text-text-primary">←</a>
            <div>
              <input
                type="text"
                [(ngModel)]="title"
                (ngModelChange)="markDirty()"
                class="text-xl font-semibold text-text-primary bg-transparent border-none outline-none"
                placeholder="Título do formulário"
              />
              @if (state().isSaving) {
                <span class="text-sm text-text-secondary ml-2">Salvando...</span>
              } @else if (state().lastSaved) {
                <span class="text-sm text-text-secondary ml-2">
                  Salvo às {{ state().lastSaved | date:'HH:mm' }}
                </span>
              } @else if (state().isDirty) {
                <span class="text-sm text-warning ml-2">Não salvo</span>
              }
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              (click)="preview()"
              class="px-4 py-2 border border-border text-text-primary rounded-lg font-medium
                     hover:bg-surface transition-colors"
              i18n="@@preview"
            >
              Visualizar
            </button>
            <button
              (click)="save()"
              [disabled]="state().isSaving"
              class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark
                     transition-colors disabled:opacity-50"
            >
              {{ state().isSaving ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </div>
      </header>

      <div class="flex-1 flex">
        <!-- Left Panel: Field Palette -->
        <aside class="w-64 bg-white border-r border-border p-4 overflow-y-auto">
          <h3 class="text-sm font-semibold text-text-secondary mb-4" i18n="@@addFields">
            Adicionar Campos
          </h3>
          <div class="space-y-2">
            @for (fieldType of fieldTypes; track fieldType.value) {
              <button
                (click)="addField(fieldType.value)"
                class="w-full p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-surface
                       transition-colors"
              >
                <span class="text-xl mr-2">{{ fieldType.icon }}</span>
                <span class="text-sm text-text-primary">{{ fieldType.label }}</span>
              </button>
            }
          </div>
        </aside>

        <!-- Center Panel: Canvas -->
        <main class="flex-1 p-6 overflow-y-auto">
          <div class="max-w-3xl mx-auto">
            <!-- Sections -->
            <div
              cdkDropList
              (cdkDropListDropped)="dropSection($event)"
              class="space-y-4"
            >
              @for (section of state().sections; track section.id; let sectionIdx = $index) {
                <div
                  class="bg-white rounded-xl border-2 transition-colors"
                  [class.border-primary]="state().selectedSectionId === section.id"
                  [class.border-border]="state().selectedSectionId !== section.id"
                >
                  <!-- Section Header -->
                  <div
                    class="px-4 py-3 border-b border-border flex items-center justify-between cursor-move"
                    cdkDrag
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-text-secondary">☰</span>
                      <input
                        type="text"
                        [(ngModel)]="section.title"
                        (ngModelChange)="markDirty()"
                        class="font-medium text-text-primary bg-transparent border-none outline-none"
                        [placeholder]="'Título da seção ' + (sectionIdx + 1)"
                      />
                    </div>
                    <button
                      (click)="selectSection(section.id)"
                      class="text-text-secondary hover:text-primary"
                    >
                      ⚙️
                    </button>
                  </div>

                  <!-- Fields in Section -->
                  <div
                    cdkDropList
                    [cdkDropListData]="getFieldsBySection(section.id)"
                    (cdkDropListDropped)="dropField($event, section.id)"
                    class="p-4 space-y-3 min-h-[100px]"
                  >
                    @for (field of getFieldsBySection(section.id); track field.id) {
                      <div
                        class="p-4 border border-dashed border-border rounded-lg cursor-pointer hover:border-primary
                               transition-colors"
                        [class.border-primary]="state().selectedFieldId === field.id"
                        [class.bg-surface]="state().selectedFieldId === field.id"
                        (click)="selectField(field.id)"
                      >
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-text-primary">
                            {{ getFieldLabel(field) || 'Campo sem label' }}
                          </span>
                          <span class="text-xs text-text-secondary">{{ field.field_type }}</span>
                        </div>
                      </div>
                    }

                    @if (getFieldsBySection(section.id).length === 0) {
                      <p class="text-center text-text-secondary text-sm py-4">
                        Arraste campos aqui ou clique em um tipo acima
                      </p>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Add Section Button -->
            <button
              (click)="addSection()"
              class="w-full mt-4 p-4 border-2 border-dashed border-border rounded-xl text-text-secondary
                     hover:border-primary hover:text-primary transition-colors text-center"
            >
              + Adicionar Seção
            </button>
          </div>
        </main>

        <!-- Right Panel: Properties -->
        <aside class="w-80 bg-white border-l border-border p-4 overflow-y-auto">
          <h3 class="text-sm font-semibold text-text-secondary mb-4" i18n="@@properties">
            Propriedades
          </h3>

          @if (selectedField()) {
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-text-secondary mb-1" i18n="@@label">Label</label>
                <input
                  type="text"
                  [(ngModel)]="selectedField()!.label"
                  (ngModelChange)="markDirty()"
                  class="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-text-secondary mb-1" i18n="@@placeholder">
                  Placeholder
                </label>
                <input
                  type="text"
                  [(ngModel)]="selectedField()!.placeholder"
                  (ngModelChange)="markDirty()"
                  class="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-medium text-text-secondary mb-1" i18n="@@helperText">
                  Texto de ajuda
                </label>
                <input
                  type="text"
                  [(ngModel)]="selectedField()!.helper_text"
                  (ngModelChange)="markDirty()"
                  class="w-full px-3 py-2 border border-border rounded-lg text-sm"
                />
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  [(ngModel)]="selectedField()!.is_required"
                  (ngModelChange)="markDirty()"
                  id="is_required"
                  class="w-4 h-4 text-primary border-border rounded"
                />
                <label for="is_required" class="text-sm text-text-primary" i18n="@@required">
                  Obrigatório
                </label>
              </div>
            </div>
          } @else {
            <p class="text-text-secondary text-sm" i18n="@@selectFieldToEdit">
              Selecione um campo para editar suas propriedades
            </p>
          }
        </aside>
      </div>
    </div>
  `,
})
export class FormBuilderEditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  private auth = inject(AuthService);
  private i18n = inject(I18nService);
  private toast = inject(ToastService);

  state = signal<FormEditorState>({
    template: null,
    sections: [],
    fields: [],
    selectedSectionId: null,
    selectedFieldId: null,
    isDirty: false,
    isSaving: false,
    lastSaved: null,
  });

  title = '';
  autoSaveInterval: any;

  fieldTypes: Array<{ value: FieldType; label: string; icon: string }> = [
    { value: 'text', label: 'Texto', icon: '📝' },
    { value: 'textarea', label: 'Texto Longo', icon: '📄' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'phone', label: 'Telefone', icon: '📱' },
    { value: 'number', label: 'Número', icon: '🔢' },
    { value: 'date', label: 'Data', icon: '📅' },
    { value: 'cpf', label: 'CPF', icon: '🆔' },
    { value: 'cnpj', label: 'CNPJ', icon: '🏢' },
    { value: 'cep', label: 'CEP', icon: '📮' },
    { value: 'select', label: 'Seleção', icon: '📋' },
    { value: 'radio', label: 'Opção Única', icon: '⭕' },
    { value: 'checkbox', label: 'Múltipla Escolha', icon: '☑️' },
    { value: 'toggle', label: 'Interruptor', icon: '🔘' },
  ];

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'new') {
      await this.loadForm(id);
    } else {
      // New form
      this.addSection();
    }

    // Auto-save every 30 seconds
    this.autoSaveInterval = setInterval(() => {
      if (this.state().isDirty) {
        this.save();
      }
    }, 30000);
  }

  private async loadForm(id: string): Promise<void> {
    const user = this.auth.currentUser();
    if (!user) return;

    const { data: template } = await this.supabase.client
      .from('form_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (template) {
      this.title = (template.title as any)?.[this.i18n.currentLang()] || '';
    }

    const { data: sections } = await this.supabase.client
      .from('form_sections')
      .select('*')
      .eq('template_id', id)
      .order('display_order', { ascending: true });

    const { data: fields } = await this.supabase.client
      .from('form_fields')
      .select('*')
      .eq('template_id', id)
      .order('display_order', { ascending: true });

    this.state.set({
      template: template as FormTemplate,
      sections: (sections as FormSection[]) || [],
      fields: (fields as FormField[]) || [],
      selectedSectionId: null,
      selectedFieldId: null,
      isDirty: false,
      isSaving: false,
      lastSaved: null,
    });
  }

  addSection(): void {
    const newSection: FormSection = {
      id: crypto.randomUUID(),
      template_id: this.state().template?.id || '',
      title: { pt: `Seção ${this.state().sections.length + 1}` },
      description: {},
      display_order: this.state().sections.length,
    };

    this.state.update((s) => ({
      ...s,
      sections: [...s.sections, newSection],
      isDirty: true,
    }));
  }

  addField(fieldType: FieldType): void {
    if (this.state().sections.length === 0) {
      this.addSection();
    }

    const sectionId = this.state().selectedSectionId || this.state().sections[0]?.id;
    if (!sectionId) return;

    const newField: FormField = {
      id: crypto.randomUUID(),
      section_id: sectionId,
      template_id: this.state().template?.id || '',
      label: { pt: `Novo campo ${fieldType}` },
      placeholder: {},
      helper_text: {},
      field_type: fieldType,
      is_required: false,
      display_order: this.getFieldsBySection(sectionId).length,
      options: null,
      currency: null,
      min_length: null,
      max_length: null,
      min_value: null,
      max_value: null,
      mask: null,
      default_value: null,
      is_active: true,
    };

    this.state.update((s) => ({
      ...s,
      fields: [...s.fields, newField],
      selectedFieldId: newField.id,
      isDirty: true,
    }));
  }

  getFieldsBySection(sectionId: string): FormField[] {
    return this.state().fields.filter((f) => f.section_id === sectionId);
  }

  selectSection(id: string): void {
    this.state.update((s) => ({ ...s, selectedSectionId: id, selectedFieldId: null }));
  }

  selectField(id: string): void {
    this.state.update((s) => ({ ...s, selectedFieldId: id }));
  }

  selectedField(): FormField | null {
    return this.state().fields.find((f) => f.id === this.state().selectedFieldId) || null;
  }

  getFieldLabel(field: FormField): string {
    const lang = this.i18n.currentLang();
    return (field.label as any)?.[lang] || (field.label as any)?.['pt'] || '';
  }

  markDirty(): void {
    this.state.update((s) => ({ ...s, isDirty: true }));
  }

  dropSection(event: CdkDragDrop<FormSection[]>): void {
    const sections = [...this.state().sections];
    moveItemInArray(sections, event.previousIndex, event.currentIndex);
    this.state.update((s) => ({ ...s, sections, isDirty: true }));
  }

  dropField(event: CdkDragDrop<FormField[]>, sectionId: string): void {
    const fields = this.state().fields.map((f) => {
      if (f.section_id === sectionId) {
        return { ...f, display_order: event.currentIndex };
      }
      return f;
    });
    this.state.update((s) => ({ ...s, fields, isDirty: true }));
  }

  async save(): Promise<void> {
    this.state.update((s) => ({ ...s, isSaving: true }));

    try {
      const user = this.auth.currentUser();
      if (!user) return;

      const templateId = this.state().template?.id || crypto.randomUUID();
      const slug = this.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Save template
      await this.supabase.client.from('form_templates').upsert({
        id: templateId,
        user_id: user.id,
        title: { pt: this.title },
        slug: slug,
        status: 'draft',
      });

      // Save sections
      for (const section of this.state().sections) {
        await this.supabase.client.from('form_sections').upsert({
          ...section,
          template_id: templateId,
        });
      }

      // Save fields
      for (const field of this.state().fields) {
        await this.supabase.client.from('form_fields').upsert({
          ...field,
          template_id: templateId,
        });
      }

      this.state.update((s) => ({
        ...s,
        isDirty: false,
        isSaving: false,
        lastSaved: new Date(),
        template: { ...s.template, id: templateId } as FormTemplate,
      }));

      this.toast.success('Formulário salvo com sucesso!');
    } catch (err: any) {
      this.toast.error(err.message || 'Erro ao salvar');
      this.state.update((s) => ({ ...s, isSaving: false }));
    }
  }

  preview(): void {
    const template = this.state().template;
    if (template?.slug) {
      window.open(`/forms/${template.slug}`, '_blank');
    }
  }
}
