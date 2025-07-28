import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';

@Component({
  selector: 'app-dashboard-inventory',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports],
  templateUrl: './dashboard-inventory.component.html',
  styleUrl: './dashboard-inventory.component.css'
})
export class DashboardInventoryComponent {


}
