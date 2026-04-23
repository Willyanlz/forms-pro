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
  fieldId: string;
  value: FieldAnswerValue;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: TranslatedField;
  placeholder: TranslatedField | null;
  helperText: TranslatedField | null;
  required: boolean;
  order: number;
  options: FieldOption[] | null;
  currency: CurrencyCode | null;
  minLength: number | null;
  maxLength: number | null;
  min: number | null;
  max: number | null;
  mask: string | null;
  defaultValue: FieldAnswerValue | null;
}

export interface FormSection {
  id: string;
  title: TranslatedField;
  description: TranslatedField | null;
  order: number;
  fields: FormField[];
}

export interface FormTemplate {
  id: string;
  userId: string;
  slug: string;
  title: TranslatedField;
  description: TranslatedField | null;
  isActive: boolean;
  isPublic: boolean;
  sections: FormSection[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  userId: string | null;
  answers: FieldAnswer[];
  submittedAt: string;
  metadata: Record<string, unknown> | null;
}
