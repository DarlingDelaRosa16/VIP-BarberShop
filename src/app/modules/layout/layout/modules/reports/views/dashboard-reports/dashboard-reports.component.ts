import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { NgxPrintModule } from 'ngx-print';
import { BabersReportService } from '../../service/reportbarber.service';
import { NoDataComponent } from '../../../../../components/no-data/no-data.component';

@Component({
  selector: 'app-dashboard-reports',
  imports: [PrimeComponentsModules, ModulesImports, MaterialComponents, NgxPrintModule, NoDataComponent],
  templateUrl: './dashboard-reports.component.html',
  styleUrl: './dashboard-reports.component.css'
})
export class DashboardReportsComponent implements OnInit{

  constructor(
    public barberReportService: BabersReportService,
  ) {

  }

  ngOnInit(): void {
    this.barberReportService.getLowStockProducts()
  }
}
