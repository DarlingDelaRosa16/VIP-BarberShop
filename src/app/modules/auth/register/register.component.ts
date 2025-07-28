import { Component } from '@angular/core';
import { ModulesImports } from '../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../helpers/primeNg';

@Component({
  selector: 'app-register',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

}
