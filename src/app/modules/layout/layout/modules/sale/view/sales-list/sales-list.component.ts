import { Component, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-sales-list',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css'
})
export class SalesListComponent implements OnInit {

  constructor(
    public salesService: SalesService,
  ) {
  }

  ngOnInit(): void {
    // this.salesService.getInvoices()
  }
}
