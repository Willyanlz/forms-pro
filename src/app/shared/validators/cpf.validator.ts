import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.replace(/\D/g, '');
    if (!value) return null;
    if (value.length !== 11) return { cpf: true };
    if (/^(\d)\1{10}$/.test(value)) return { cpf: true };

    // First digit
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(value.charAt(i)) * (10 - i);
    let remainder = 11 - (sum % 11);
    if (remainder >= 10) remainder = 0;
    if (remainder !== parseInt(value.charAt(9))) return { cpf: true };

    // Second digit
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(value.charAt(i)) * (11 - i);
    remainder = 11 - (sum % 11);
    if (remainder >= 10) remainder = 0;
    if (remainder !== parseInt(value.charAt(10))) return { cpf: true };

    return null;
  };
}
