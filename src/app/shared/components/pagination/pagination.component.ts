import { Component, EventEmitter, Output, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="flex items-center gap-1" aria-label="Paginação">
      <!-- First -->
      <button
        type="button"
        (click)="goTo(1)"
        [disabled]="currentPage() <= 1"
        class="pagination-btn"
        aria-label="Primeira página"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Prev -->
      <button
        type="button"
        (click)="goTo(currentPage() - 1)"
        [disabled]="currentPage() <= 1"
        class="pagination-btn"
        aria-label="Página anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Page numbers -->
      @for (page of visiblePages(); track page) {
        @if (page === -1) {
          <span class="px-2 py-1 text-sm text-text-secondary">…</span>
        } @else {
          <button
            type="button"
            (click)="goTo(page)"
            [class.active]="page === currentPage()"
            class="pagination-btn"
            [attr.aria-current]="page === currentPage() ? 'page' : null"
          >
            {{ page }}
          </button>
        }
      }

      <!-- Next -->
      <button
        type="button"
        (click)="goTo(currentPage() + 1)"
        [disabled]="currentPage() >= totalPages()"
        class="pagination-btn"
        aria-label="Próxima página"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Last -->
      <button
        type="button"
        (click)="goTo(totalPages())"
        [disabled]="currentPage() >= totalPages()"
        class="pagination-btn"
        aria-label="Última página"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M6 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  `,
  styles: [`
    .pagination-btn {
      @apply min-w-[32px] h-8 px-2 flex items-center justify-center rounded-lg text-sm
             text-text-primary border border-transparent
             hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed;
    }
    .pagination-btn.active {
      @apply bg-primary text-white border-primary font-medium;
    }
  `],
})
export class PaginationComponent {
  readonly currentPage = input<number>(1);
  readonly totalPages = input<number>(1);
  readonly pageSize = input<number>(10);

  @Output() pageChange = new EventEmitter<number>();

  visiblePages = computed<number[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];

    if (current > 3) pages.push(-1); // ellipsis

    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
      pages.push(p);
    }

    if (current < total - 2) pages.push(-1); // ellipsis
    pages.push(total);

    return pages;
  });

  goTo(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }
}
