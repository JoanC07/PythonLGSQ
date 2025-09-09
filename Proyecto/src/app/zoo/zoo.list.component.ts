import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ZooService } from './zoo.service';
import { Zoo } from './zoo.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/zoos/nuevo">➕ Nuevo</a>

    <table *ngIf="zoos().length; else empty" style="width:100%; border-collapse:collapse">
      <thead>
        <tr>
          <th style="text-align:left; border-bottom:1px solid #ccc">ID</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Nombre</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Ciudad</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">País</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Tamaño</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Presupuesto</th>
          <th style="text-align:left; border-bottom:1px solid #ccc">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let z of zoos()">
          <td style="border-bottom:1px solid #eee">{{ z.id_zoo }}</td>
          <td style="border-bottom:1px solid #eee">{{ z.nombre }}</td>
          <td style="border-bottom:1px solid #eee">{{ z.ciudad }}</td>
          <td style="border-bottom:1px solid #eee">{{ z.pais }}</td>
          <td style="border-bottom:1px solid #eee">{{ z.tamano }}</td>
          <td style="border-bottom:1px solid #eee">{{ z.presupuesto }}</td>
          <td style="border-bottom:1px solid #eee">
            <a [routerLink]="['/zoos', z.id_zoo]">Editar</a>
            <button (click)="onDelete(z.id_zoo)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #empty>
      <p>No hay registros. Crea el primero.</p>
    </ng-template>
  `
})
export class ZooListComponent implements OnInit {
  private service = inject(ZooService);
  zoos = signal<Zoo[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(data => this.zoos.set(data));
  }

  onDelete(id: number) {
    if (!confirm('¿Eliminar?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
