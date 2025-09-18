import { Component, Inject } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../helpers/material';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-data',
  imports: [PrimeComponentsModules, MaterialComponents, ModulesImports],
  templateUrl: './detail-data.component.html',
  styleUrl: './detail-data.component.css'
})
export class DetailDataComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public propiedad: { elementoList: any[], nombre: string, entidad: string, icon: string },
    private dialogRef: MatDialogRef<DetailDataComponent>,
  ) {
  }

  close(){
    this.dialogRef.close()
  }

}
