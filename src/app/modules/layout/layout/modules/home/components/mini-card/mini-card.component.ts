import { Component, input } from '@angular/core';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';

@Component({
  selector: 'mini-card',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './mini-card.component.html',
  styleUrl: './mini-card.component.css'
})
export class MiniCardComponent {
  link = input<string>()
  name = input<string>()
  amount = input<number>()
  icon = input<string>()

}
