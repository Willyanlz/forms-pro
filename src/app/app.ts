import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from '@core/services/i18n.service';
import { ThemeService } from '@core/services/theme.service';
import { ToastContainerComponent } from '@shared/components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly i18n = inject(I18nService);
  private readonly theme = inject(ThemeService);

  protected readonly title = signal('labs-will');

  constructor() {
    this.i18n.init();
    this.theme.initTheme();
  }
}
