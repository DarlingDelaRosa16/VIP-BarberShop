import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrimeComponentsModules } from '../../../../../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../../../../../helpers/material';
import { ModulesImports } from '../../../../../../../../../helpers/modulesImports';

@Component({
  selector: 'app-view-details-inbound',
  imports: [PrimeComponentsModules, MaterialComponents, ModulesImports],
  templateUrl: './view-details-inbound.component.html',
  styleUrl: './view-details-inbound.component.css'
})
export class ViewDetailsInboundComponent implements OnInit {

  subTotal: number = 0
  totalSum: number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private dialogRef: MatDialogRef<ViewDetailsInboundComponent>,
  ) {
    console.log(data);

  }

  ngOnInit(): void {
    this.sumTotal()
  }

  sumTotal(){
    this.data.entry_details.map((item: any) =>{
      this.subTotal = 0
      this.subTotal += item.unit_price * item.quantity
      this.totalSum += this.subTotal
    })
  }

  close() {
    this.dialogRef.close()
  }
}
