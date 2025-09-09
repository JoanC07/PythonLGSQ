import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AnimalService } from './animal.service';
import { Animal, AnimalCreate } from './animal.model';
import { ZooService } from '../zoo/zoo.service';
import { EspecieService } from '../especie/especie.service';
import { Zoo } from '../zoo/zoo.model';
import { Especie } from '../especie/especie.model';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <a routerLink="/animales">⬅ Volver</a>
    <h2>{{ isEdit ? 'Editar Animal' : 'Nuevo Animal' }}</h2>

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

      <label>Zoo
        <select formControlName="id_zoo">
          <option *ngFor="let z of zoos" [value]="z.id_zoo">{{ z.nombre }}</option>
        </select>
      </label>

      <label>Especie
        <select formControlName="id_especie">
          <option *ngFor="let e of especies" [value]="e.id_especie">{{ e.nombre_vulgar }}</option>
        </select>
      </label>

      <label>País de origen <input formControlName="pais_origen"></label>
      <label>Continente <input formControlName="continente"></label>

      <button [disabled]="form.invalid">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
    </form>
  `
})
export class AnimalFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(AnimalService);
  private zooSrv = inject(ZooService);
  private espSrv = inject(EspecieService);

  isEdit = false;
  id: number | null = null;

  zoos: Zoo[] = [];
  especies: Especie[] = [];

  form = new FormGroup({
    identificacion: new FormControl('', { nonNullable:true, validators:[Validators.required] }),
    sexo: new FormControl('', { nonNullable:true, validators:[Validators.required] }),
    anio_nacimiento: new FormControl<string | null>(null),
    id_zoo: new FormControl<number | null>(null, { validators:[Validators.required] }),
    id_especie: new FormControl<number | null>(null, { validators:[Validators.required] }),
    pais_origen: new FormControl<string | null>(null),
    continente: new FormControl<string | null>(null)
  });

  ngOnInit(){
    // Llenamos los combos
    this.zooSrv.getAll().subscribe(z => this.zoos = z);
    this.espSrv.getAll().subscribe(e => this.especies = e);

    const idParam = this.route.snapshot.paramMap.get('id');
    if(idParam){
      this.isEdit = true;
      this.id = +idParam;
      this.service.getById(this.id).subscribe((a: Animal) => this.form.patchValue(a));
    }
  }

  submit(){
    const payload = this.form.getRawValue() as AnimalCreate;
    if(this.isEdit && this.id != null)
      this.service.update(this.id, payload).subscribe(()=> this.router.navigate(['/animales']));
    else
      this.service.create(payload).subscribe(()=> this.router.navigate(['/animales']));
  }
}
