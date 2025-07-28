import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';

@Component({
  selector: 'snackbarServerError',
  standalone: true,
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './snackServerError.component.html',
})
export class SnackbarServerError {

  constructor(
    private snackBarRef: MatSnackBarRef<SnackbarServerError>
  ){}

  closeSnackbar() { this.snackBarRef.dismiss() }
}
