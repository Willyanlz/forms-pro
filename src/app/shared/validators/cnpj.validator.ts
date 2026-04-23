import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.replace(/\D/g, '');
    if (!value) return null;
    if (value.length !== 14) return { cnpj: true };
    if (/^(\d)\1{13}$/.test(value)) return { cnpj: true };

    // First digit – weights [5,4,3,2,9,8,7,6,5,4,3,2]
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) sum += parseInt(value.charAt(i)) * weights1[i];
    let remainder = sum % 11;
    const digit1 = remainder < 2 ? 0 : 11 - remainder;
    if (digit1 !== parseInt(value.charAt(12))) return { cnpj: true };

    // Second digit – weights [6,5,4,3,2,9,8,7,6,5,4,3,2]
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) sum += parseInt(value.charAt(i)) * weights2[i];
    remainder = sum % 11;
    const digit2 = remainder < 2 ? 0 : 11 - remainder;
    if (digit2 !== parseInt(value.charAt(13))) return { cnpj: true };

    return null;
  };
}
