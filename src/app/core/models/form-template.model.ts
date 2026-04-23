import { TranslatedField } from './translated-field.model';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'money'
  | 'date'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'email'
  | 'phone'
  | 'cpf'
  | 'cnpj'
  | 'cep'
  | 'url'
  | 'toggle';

export type CurrencyCode =
  | 'BRL'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'ARS'
  | 'CLP'
  | 'COP'
  | 'PYG'
  | 'UYU'
  | 'BOB'
  | 'PEN';

export interface FieldOption {
  value: string;
  label: TranslatedField;
}

export interface MoneyValue {
  amount: number;
  currency: CurrencyCode;
}

export type FieldAnswerValue =
  | string
  | number
  | boolean
  | string[]
  | MoneyValue
  | null;

export interface FieldAnswer {
  field_id: string;
  value: FieldAnswerValue;
}

export interface FormField {
  id: string;
  template_id: string;
  section_id: string;
  field_type: FieldType;
  label: TranslatedField;
  placeholder: TranslatedField | null;
  helper_text: TranslatedField | null;
  is_required: boolean;
  display_order: number;
  options: FieldOption[] | null;
  currency: CurrencyCode | null;
  min_length: number | null;
  max_length: number | null;
  min_value: number | null;
  max_value: number | null;
  mask: string | null;
  default_value: FieldAnswerValue | null;
  conditional_field_id?: string | null;
  conditional_value?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FormSection {
  id: string;
  template_id: string;
  title: TranslatedField;
  description: TranslatedField | null;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface FormTemplate {
  id: string;
  user_id: string | null;
  slug: string;
  title: TranslatedField;
  description: TranslatedField | null;
  status: 'draft' | 'active' | 'archived';
  display_order?: number | null;
  created_at: string;
  updated_at: string;
}

export interface FormSubmission {
  id: string;
  template_id: string;
  user_id: string | null;
  template_title: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  answers: Record<string, FieldAnswerValue>;
  status?: 'new' | 'read' | 'archived';
  submitted_at: string;
  metadata: Record<string, unknown> | null;
}
