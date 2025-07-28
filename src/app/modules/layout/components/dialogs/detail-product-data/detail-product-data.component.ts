import { Component, Inject } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-product-data',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './detail-product-data.component.html',
  styleUrl: './detail-product-data.component.css'
})
export class DetailProductDataComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public propiedad: { elementoList: any[], nombre: string },
  ) { }

}
