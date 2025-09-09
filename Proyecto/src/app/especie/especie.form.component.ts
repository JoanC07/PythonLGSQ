import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { EspecieService } from './especie.service';
import { Especie, EspecieCreate } from './especie.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/especies">⬅ Volver</a>
    <h2>{{ isEdit ? 'Editar Especie' : 'Nueva Especie' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:grid;gap:.7rem;max-width:420px">
      <label>Nombre vulgar <input formControlName="nombre_vulgar"></label>
      <label>nombre cientifico <input formControlName="nombre_cientifico"></label>
      <label>Familia <input formControlName="familia_pertenece"></label>
      <label>Peligro de extincion <input formControlName="peligro_extincion"></label>
      <button [disabled]="form.invalid">{{ isEdit ? 'Guardar cambios' : 'Crear' }}</button>
    </form>
  `
})
export class EspecieFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(EspecieService);

  isEdit = false;
  id: number | null = null;

  form = new FormGroup({
    nombre_vulgar: new FormControl('', { nonNullable:true, validators:[Validators.required] }),
    nombre_cientifico: new FormControl('', { nonNullable:true, validators:[Validators.required] }),
    familia_pertenece: new FormControl('', { nonNullable:true, validators:[Validators.required] }),
    peligro_extincion: new FormControl('', { validators:[Validators.required] }),
  });

  ngOnInit(){
    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){
      this.isEdit = true;
      this.id = +idParam;
      this.service.getById(this.id).subscribe((e: Especie) => this.form.patchValue(e));
    }
  }

  onSubmit(){
    const payload = this.form.getRawValue() as EspecieCreate;
    if(this.isEdit && this.id != null)
      this.service.update(this.id, payload).subscribe(() => this.router.navigate(['/especies']));
    else
      this.service.create(payload).subscribe(() => this.router.navigate(['/especies']));
  }
}
