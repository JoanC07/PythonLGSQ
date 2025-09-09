import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimalService } from './animal.service';
import { Animal } from './animal.model';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a routerLink="/animales/nuevo">➕ Nuevo</a>

    <table *ngIf="animales().length; else empty" style="width:100%; border-collapse:collapse; margin-top:1rem">
      <thead>
        <tr>
          <th style="border-bottom:1px solid #ccc">ID</th>
          <th style="border-bottom:1px solid #ccc">Identificación</th>
          <th style="border-bottom:1px solid #ccc">Sexo</th>
          <th style="border-bottom:1px solid #ccc">Nacimiento</th>
          <th style="border-bottom:1px solid #ccc">Zoo</th>
          <th style="border-bottom:1px solid #ccc">Especie</th>
          <th style="border-bottom:1px solid #ccc">Origen</th>
          <th style="border-bottom:1px solid #ccc">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let a of animales()">
          <td style="border-bottom:1px solid #eee">{{ a.id_animal }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.identificacion }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.sexo }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.anio_nacimiento || '-' }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.zoo_nombre || a.id_zoo }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.especie_nombre || a.id_especie }}</td>
          <td style="border-bottom:1px solid #eee">{{ a.pais_origen || '-' }} / {{ a.continente || '-' }}</td>
          <td style="border-bottom:1px solid #eee">
            <a [routerLink]="['/animales', a.id_animal]">Editar</a>
            <button (click)="del(a.id_animal)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ng-template #empty><p>No hay registros. Crea el primero.</p></ng-template>
  `
})
export class AnimalListComponent implements OnInit {
  private service = inject(AnimalService);
  animales = signal<Animal[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(d => this.animales.set(d));
  }

  del(id: number) {
    if (!confirm('¿Eliminar?')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
