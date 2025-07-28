import { Component } from '@angular/core';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../helpers/material';

@Component({
  selector: 'snackBarSuccess',
  standalone: true,
  imports: [MaterialComponents, ModulesImports],
  templateUrl: './snackSuccess.component.html',
})
export class SnackBarSuccess {

}
