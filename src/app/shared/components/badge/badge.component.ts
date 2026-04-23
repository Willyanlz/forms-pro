import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'active' | 'draft' | 'archived' | 'new' | 'read' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      [ngClass]="variantClasses()"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    >
      <ng-content></ng-content>
    </span>
  `,
  styles: [],
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('active');

  variantClasses(): Record<string, boolean> {
    return {
      'bg-green-100 text-green-800':  this.variant() === 'active' || this.variant() === 'success',
      'bg-gray-100 text-gray-600':    this.variant() === 'draft' || this.variant() === 'read',
      'bg-red-100 text-red-700':      this.variant() === 'archived' || this.variant() === 'error',
      'bg-blue-100 text-blue-800':    this.variant() === 'new',
      'bg-yellow-100 text-yellow-800':this.variant() === 'warning',
    };
  }
}
