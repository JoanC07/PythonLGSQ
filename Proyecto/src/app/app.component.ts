import { Component } from '@angular/core';
import { RouterLink,RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <h1>🦁 Zoológico</h1>
    <nav>
      <a routerLink="/zoos">Zoos</a> |
      <a routerLink="/especies">Especies</a> |
      <a routerLink="/animales">Animales</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}