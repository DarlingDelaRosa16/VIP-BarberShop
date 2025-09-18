import { Component, Inject } from '@angular/core';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../helpers/material';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'snackBarMessage',
  standalone: true,
  imports: [MaterialComponents, ModulesImports],
  templateUrl: './snackBarMessage.component.html',
})
export class SnackBarMessage {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
