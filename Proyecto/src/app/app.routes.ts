import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'zoos', pathMatch: 'full' },

  // ZOOS
  { path: 'zoos',       loadComponent: () => import('./zoo/zoo.list.component').then(m => m.ZooListComponent) },
  { path: 'zoos/nuevo', loadComponent: () => import('./zoo/zoo.form.component').then(m => m.ZooFormComponent) },
  { path: 'zoos/:id',   loadComponent: () => import('./zoo/zoo.form.component').then(m => m.ZooFormComponent) },

  // ESPECIES
  { path: 'especies',       loadComponent: () => import('./especie/especie.list.component').then(m => m.EspecieListComponent) },
  { path: 'especies/nuevo', loadComponent: () => import('./especie/especie.form.component').then(m => m.EspecieFormComponent) },
  { path: 'especies/:id',   loadComponent: () => import('./especie/especie.form.component').then(m => m.EspecieFormComponent) },

  // ANIMALES
  { path: 'animales',       loadComponent: () => import('./animal/animal.list.component').then(m => m.AnimalListComponent) },
  { path: 'animales/nuevo', loadComponent: () => import('./animal/animal.form.component').then(m => m.AnimalFormComponent) },
  { path: 'animales/:id',   loadComponent: () => import('./animal/animal.form.component').then(m => m.AnimalFormComponent) },

  { path: '**', redirectTo: 'zoos' }
];
