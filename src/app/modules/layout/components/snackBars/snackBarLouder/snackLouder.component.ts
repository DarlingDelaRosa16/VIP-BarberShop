import { Component } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material';
import { ModulesImports } from '../../../../../helpers/modulesImports';

@Component({
  selector: 'snackBar-loader',
  standalone: true,
  imports: [MaterialComponents, ModulesImports],
  templateUrl: './snackLouder.component.html',
})
export class SnackBarLouder {

}
