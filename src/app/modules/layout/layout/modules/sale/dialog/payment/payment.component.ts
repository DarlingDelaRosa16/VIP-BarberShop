import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';

@Component({
  selector: 'app-payment',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  selectedPaymentMethod: number = 1;
  quickAmounts = [100, 120, 150, 200, 500, 1000, 2000];

  constructor(){

  }

  ngOnInit(): void {

  }


  selectPaymentMethod(value: number): void {
    this.selectedPaymentMethod = value;
  }
}
