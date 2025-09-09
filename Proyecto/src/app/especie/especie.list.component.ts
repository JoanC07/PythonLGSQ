import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EspecieService } from './especie.service';
import { Especie } from './especie.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/especies/nuevo">➕ Nuevo</a>

    <table *ngIf="items().length; else empty" style="width:100%; border-collapse:collapse; margin-top:1rem">
      <thead>
        <tr>
          <th style="text-align:left; border-bottom:1px solid #ccc">ID</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Vulgar</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Científico</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Familia</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Peligro</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let e of items()">
          <td style="border-bottom:1px solid #eee">{{ e.id_especie }}</td>
          <td style="border-bottom:1px solid #eee">{{ e.nombre_vulgar }}</td>
          <td style="border-bottom:1px solid #eee">{{ e.nombre_cientifico }}</td>
          <td style="border-bottom:1px solid #eee">{{ e.familia_pertenece }}</td>
          <td style="border-bottom:1px solid #eee">{{ e.peligro_extincion }}</td>
          <td style="border-bottom:1px solid #eee">
            <a [routerLink]="['/especies', e.id_especie]">Editar</a>
            <button (click)="del(e.id_especie)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #empty>
      <p>No hay registros. Crea el primero.</p>
    </ng-template>
  `
})
export class EspecieListComponent implements OnInit {
  private service = inject(EspecieService);
  items = signal<Especie[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(d => this.items.set(d));
  }

  del(id: number) {
    if (!confirm('¿Eliminar?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
