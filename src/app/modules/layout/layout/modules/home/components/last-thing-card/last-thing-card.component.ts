import { Component, input, OnInit } from '@angular/core';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { PopularServicesI } from '../../../../interface/general.Interface';
import { GeneralRequestService } from '../../../../services/generalRequest.service';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { BarbershopService } from '../../../barbershop/service/barbershop.service';
import { SalesService } from '../../../sale/services/sales.service';

@Component({
  selector: 'app-last-thing-card',
  imports: [ModulesImports, PrimeComponentsModules, MaterialComponents],
  templateUrl: './last-thing-card.component.html',
  styleUrl: './last-thing-card.component.css'
})
export class LastThingCardComponent implements OnInit{
  // popularServices = input<PopularServicesI[] | any >()
  link = input<string>()
  type = input<number>()
  icon = input<string>()
  title = input<string>()
  subTitle = input<string>()

   constructor(
      public generalService: GeneralRequestService,
      public saleService: SalesService,
      public datesService: BarbershopService
    ) { }

    ngOnInit(): void {
      this.generalService.getDaily()
      this.saleService.getInvoices()
      this.generalService.getPopularServices()

      this.datesService.getDates()
    }
}
