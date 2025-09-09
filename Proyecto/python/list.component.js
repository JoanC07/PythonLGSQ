import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UniversidadService } from './Universidad.service';
import { Universidad } from './Universidad.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/Universidades/nuevo">➕ Nuevo</a>

    <table *ngIf="Universidades().length; else empty" style="width:100%; border-collapse:collapse; margin-top:1rem">
      <thead>
        <tr>
          <th style="border-bottom:1px solid #ccc">ID</th>
          <th style="border-bottom:1px solid #ccc">Identificación</th>
          <th style="border-bottom:1px solid #ccc">Sexo</th>
          <th style="border-bottom:1px solid #ccc">Nacimiento</th>
          <th style="border-bottom:1px solid #ccc">Estudiante</th>
          <th style="border-bottom:1px solid #ccc">Profesor</th>
          <th style="border-bottom:1px solid #ccc">Origen</th>
          <th style="border-bottom:1px solid #ccc">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of Universidades()">
          <td style="border-bottom:1px solid #eee">{{ a.id_Universidad }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.identificacion }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.sexo }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.anio_nacimiento || '-' }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.Estudiante_nombre || a.id_Estudiante }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.Profesor_nombre || a.id_Profesor }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.pais_origen || '-' }} / {{ a.continente || '-' }}</td>
          <td style="border-bottom:1px solid #eee">
            <a [routerLink]="['/Universidades', a.id_Universidad]">Editar</a>
            <button (click)="del(a.id_Universidad)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #empty><p>No hay registros. Crea el primero.</p></ng-template>
  `
})
export class UniversidadListComponent implements OnInit {
  private service = inject(UniversidadService);
  Universidades = signal<Universidad[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(d => this.Universidades.set(d));
  }

  del(id: number) {
    if (!confirm('¿Eliminar?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
