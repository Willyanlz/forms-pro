import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {

  stats: any = {};
  loading = true;

  constructor(private superAdminService: SuperAdminService) { }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.superAdminService.getGlobalStats().subscribe({
      next: (result: any) => {
        // Suporte ambos formatos: resposta completa Supabase e retorno direto RPC
        this.stats = result?.data ?? result ?? {};
        this.loading = false;
        console.log('✅ Dashboard stats carregados:', this.stats);
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
