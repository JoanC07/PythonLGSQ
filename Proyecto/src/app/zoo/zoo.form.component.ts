import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ZooService } from './zoo.service';
import { Zoo, ZooCreate } from './zoo.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/zoos">⬅ Volver</a>
    <h2>{{ isEdit ? 'Editar Zoo' : 'Nuevo Zoo' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:grid;gap:.7rem;max-width:420px">
      <label>Nombre <input formControlName="nombre"></label>
      <label>Ciudad <input formControlName="ciudad"></label>
      <label>País <input formControlName="pais"></label>
      <label>Tamaño <input type="number" step="0.01" formControlName="tamano"></label>
      <label>Presupuesto <input type="number" step="0.01" formControlName="presupuesto"></label>
      <button [disabled]="form.invalid">{{ isEdit ? 'Guardar cambios' : 'Crear' }}</button>
    </form>
  `
})
export class ZooFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(ZooService);

  isEdit = false;
  id: number | null = null;

  form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    ciudad: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    pais: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    tamano: new FormControl<number | null>(null, { validators: [Validators.required] }),
    presupuesto: new FormControl<number | null>(null, { validators: [Validators.required] })
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.id = +idParam;
      this.service.getById(this.id).subscribe((z: Zoo) => {
        this.form.patchValue({
          nombre: z.nombre,
          ciudad: z.ciudad,
          pais: z.pais,
          tamano: z.tamano,
          presupuesto: z.presupuesto
        });
      });
    }
  }

  onSubmit() {
    const payload = this.form.getRawValue() as ZooCreate;
    if (this.isEdit && this.id != null) {
      this.service.update(this.id, payload).subscribe(() => this.router.navigate(['/zoos']));
    } else {
      this.service.create(payload).subscribe(() => this.router.navigate(['/zoos']));
    }
  }
}
