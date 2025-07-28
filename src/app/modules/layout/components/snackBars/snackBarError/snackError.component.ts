import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../helpers/material';

@Component({
  selector: 'snackbarError',
  standalone: true,
  imports: [MaterialComponents, ModulesImports],
  templateUrl: './snackError.component.html',
})
export class SnackbarError {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
