import { Component } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';

@Component({
  selector: 'app-dashboard-reports',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './dashboard-reports.component.html',
  styleUrl: './dashboard-reports.component.css'
})
export class DashboardReportsComponent {

}
