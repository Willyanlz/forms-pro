import { Component } from '@angular/core';

@Component({
  selector: 'contact',
  template: `
    <div class="max-w-2xl mx-auto mx-4 pt-20 pb-10 text-center space-y-6">
      <p class="text-2xl">📞</p>
      <p class="text-lg">WhatsApp: <strong>+55 16 99776-0515</strong></p>
      <p class="text-md">Quero saber mais sobre o Forms Pro!</p>
      <a href="https://wa.me/16997760515" target="_blank" class="text-primary hover:underline">Abrir WhatsApp</a>
    </div>
  `
})
export class ContactComponent {}