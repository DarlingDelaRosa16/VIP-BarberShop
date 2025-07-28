import { Component } from '@angular/core';
import { ModulesImports } from './helpers/modulesImports';

@Component({
  selector: 'app-root',
  imports: [ModulesImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'BarberShopAdmin';
}
