import { Component } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../helpers/modulesImports';

@Component({
  selector: 'app-reports',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {

}
