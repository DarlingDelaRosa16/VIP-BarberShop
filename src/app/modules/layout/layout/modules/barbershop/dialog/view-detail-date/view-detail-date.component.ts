import { Component, Inject, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PersonGetI } from '../../../../interface/general.Interface';
import { DatesGetI, DatesSetDetailViewI } from '../../interface/barbershop.interface';

@Component({
  selector: 'app-view-detail-date',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './view-detail-date.component.html',
  styleUrl: './view-detail-date.component.css'
})
export class ViewDetailDateComponent implements OnInit {

  totalDuration: number = 0
  totalSum: number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DatesSetDetailViewI,
    private dialogRef: MatDialogRef<ViewDetailDateComponent>,
  ) {
    console.log(data);

  }

  ngOnInit(): void {
    this.sumTotal()
  }

  sumTotal(){
    this.data.services.map((item)=>{
      this.totalDuration += item.duration
      this.totalSum += item.price
    })
  }

  close() {
    this.dialogRef.close()
  }
}
