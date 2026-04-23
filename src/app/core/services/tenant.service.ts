import { Injectable, signal } from '@angular/core';

// TODO: Activate for multi-tenant Phase 2
@Injectable({ providedIn: 'root' })
export class TenantService {
  currentTenantId = signal<string | null>(null);
  currentTenantSlug = signal<string | null>(null);

  setTenant(_userId: string, _slug: string): void {
    // TODO: Activate for multi-tenant Phase 2
    // this.currentTenantId.set(_userId);
    // this.currentTenantSlug.set(_slug);
  }

  resolveTenantFromUrl(_url: string): string | null {
    // TODO: Activate for multi-tenant Phase 2
    // const match = _url.match(/^https?:\/\/([^.]+)\./);
    // return match ? match[1] : null;
    return null;
  }
}
