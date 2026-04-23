import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-surface">
      <div class="text-center px-4">
        <h1 class="text-9xl font-bold text-primary">404</h1>
        <p class="text-2xl font-semibold text-text-primary mt-4" i18n="@@pageNotFound">
          Página não encontrada
        </p>
        <p class="text-text-secondary mt-2" i18n="@@pageNotFoundDesc">
          A página que você está procurando não existe.
        </p>
        <a
          routerLink="/"
          class="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg font-medium
                 hover:bg-primary-dark transition-colors"
          i18n="@@goHome"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}