import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../helpers/modulesImports';

@Component({
  selector: 'app-configurations',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports],
  templateUrl: './configurations.component.html',
  styleUrl: './configurations.component.css'
})
export class ConfigurationsComponent {

}
