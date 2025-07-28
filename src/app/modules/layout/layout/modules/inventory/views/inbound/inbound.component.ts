import { Component } from '@angular/core';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';

@Component({
  selector: 'app-inbound',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './inbound.component.html',
  styleUrl: './inbound.component.css'
})
export class InboundComponent {

}
