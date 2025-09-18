import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { invoiceGetI } from '../../interface/sale.interface';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-show-invoice',
  imports: [PrimeComponentsModules, MaterialComponents, ModulesImports, NgxPrintModule],
  templateUrl: './show-invoice.component.html',
  styleUrl: './show-invoice.component.css'
})
export class ShowInvoiceComponent implements OnInit {

  date: Date = new Date()

  constructor(
    @Inject(MAT_DIALOG_DATA) public propiedad: {invoice: invoiceGetI} ,
    private dialogRef: MatDialogRef<ShowInvoiceComponent>,
  ) {
  }

  ngOnInit(): void {
     setTimeout(() => {
     }, 500);
  }

  close() {
    this.dialogRef.close()
  }

}
