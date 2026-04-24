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
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink, 
    TranslateModule, 
    DragDropModule
  ],
  templateUrl: './form-builder-editor.component.html',
  styleUrl: './form-builder-editor.component.scss'
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
      this.title = (template.title as any)?.[this.i18n.currentLang()] || (template.title as any)?.['pt'] || '';
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
      selectedSectionId: newSection.id,
      selectedFieldId: null
    }));
  }

  removeSection(id: string): void {
    this.state.update(s => ({
      ...s,
      sections: s.sections.filter(sec => sec.id !== id),
      fields: s.fields.filter(f => f.section_id !== id),
      isDirty: true
    }));
  }

  addField(fieldType: FieldType): void {
    if (this.state().sections.length === 0) {
      this.addSection();
    }

    const sectionId = this.state().selectedSectionId || this.state().sections[this.state().sections.length - 1]?.id;
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

  removeField(id: string): void {
    this.state.update(s => ({
      ...s,
      fields: s.fields.filter(f => f.id !== id),
      isDirty: true
    }));
  }

  getFieldsBySection(sectionId: string): FormField[] {
    return this.state().fields.filter((f) => f.section_id === sectionId);
  }

  selectSection(id: string): void {
    this.state.update((s) => ({ ...s, selectedSectionId: id, selectedFieldId: null }));
  }

  selectField(id: string): void {
    const field = this.state().fields.find(f => f.id === id);
    this.state.update((s) => ({ ...s, selectedFieldId: id, selectedSectionId: field?.section_id || null }));
  }

  selectedField(): FormField | null {
    return this.state().fields.find((f) => f.id === this.state().selectedFieldId) || null;
  }

  selectedSection(): FormSection | null {
    return this.state().sections.find((s) => s.id === this.state().selectedSectionId) || null;
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
    sections.forEach((s, i) => s.display_order = i);
    this.state.update((s) => ({ ...s, sections, isDirty: true }));
  }

  dropField(event: CdkDragDrop<FormField[]>, sectionId: string): void {
    const fields = [...this.state().fields];
    // This logic needs to be more robust for cross-section dragging if enabled, 
    // but for now we'll just handle reordering within same section
    const sectionFields = fields.filter(f => f.section_id === sectionId);
    moveItemInArray(sectionFields, event.previousIndex, event.currentIndex);
    
    // Update display orders
    sectionFields.forEach((f, i) => f.display_order = i);
    
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
