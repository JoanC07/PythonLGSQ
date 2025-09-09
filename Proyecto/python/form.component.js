import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { UniversidadService } from './Universidad.service';
import { Universidad, UniversidadCreate } from './Universidad.model';
import { EstudianteService } from '../Estudiante/Estudiante.service';
import { ProfesorService } from '../Profesor/Profesor.service';
import { Estudiante } from '../Estudiante/Estudiante.model';
import { Profesor } from '../Profesor/Profesor.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/Universidades">⬅ Volver</a>
    <h2>{{ isEdit ? 'Editar Universidad' : 'Nuevo Universidad' }}</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" style="display:grid;gap:.7rem;max-width:520px">
      <label>Identificación <input formControlName="identificacion"></label>

      <label>Sexo
        <select formControlName="sexo">
          <option value="" disabled>-- Selecciona --</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
      </label>

      <label>Fecha nacimiento
        <input type="date" formControlName="anio_nacimiento">
      </label>

      <label>Estudiante
        <select formControlName="id_Estudiante">
          <option *ngFor="let z of Estudiantes" [value]="z.id_Estudiante">{{ z.nombre }}</option>
        </select>
      </label>

      <label>Profesor
        <select formControlName="id_Profesor">
          <option *ngFor="let e of Profesors" [value]="e.id_Profesor">{{ e.nombre_vulgar }}</option>
        </select>
      </label>

      <label>País de origen <input formControlName="pais_origen"></label>
      <label>Continente <input formControlName="continente"></label>

      <button [disabled]="form.invalid">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
    </form>
  `
})
export class UniversidadFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(UniversidadService);
  private EstudianteSrv = inject(EstudianteService);
  private espSrv = inject(ProfesorService);

  isEdit = false;
  id: number | null = null;

  Estudiantes: Estudiante[] = [];
  Profesors: Profesor[] = [];

  form = new FormGroup({
    identificacion: new FormControl('', { nonNullable:true, validators:[Validators.required] }),
    sexo: new FormControl('', { nonNullable:true, validators:[Validators.required] }),
    anio_nacimiento: new FormControl<string | null>(null),
    id_Estudiante: new FormControl<number | null>(null, { validators:[Validators.required] }),
    id_Profesor: new FormControl<number | null>(null, { validators:[Validators.required] }),
    pais_origen: new FormControl<string | null>(null),
    continente: new FormControl<string | null>(null)
  });

  ngOnInit(){
    // Llenamos los combos
    this.EstudianteSrv.getAll().subscribe(z => this.Estudiantes = z);
    this.espSrv.getAll().subscribe(e => this.Profesors = e);

    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){
      this.isEdit = true;
      this.id = +idParam;
      this.service.getById(this.id).subscribe((a: Universidad) => this.form.patchValue(a));
    }
  }

  submit(){
    const payload = this.form.getRawValue() as UniversidadCreate;
    if(this.isEdit && this.id != null)
      this.service.update(this.id, payload).subscribe(()=> this.router.navigate(['/Universidades']));
    else
      this.service.create(payload).subscribe(()=> this.router.navigate(['/Universidades']));
  }
}
