import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MaterialComponents } from '../../../../../helpers/material';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';

@Component({
    selector: 'snackbarConfirmDelete',
    standalone: true,
    imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
    templateUrl: 'snackConfirmation.component.html'
})
export class SnackConfirmation {

    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: any,
        private snackBarRef: MatSnackBarRef<SnackConfirmation>
    ) { }

    onComfirm() { this.snackBarRef.dismissWithAction() }
    closeSnackbar() { this.snackBarRef.dismiss() }
}
