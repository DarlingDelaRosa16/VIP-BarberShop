import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { MatDialog } from '@angular/material/dialog';
import { OutboundService } from './service/outbound.service';
import { CreateOutboundComponent } from './dialog/create-outbound/create-outbound.component';
import { CreateOutboundDispatchComponent } from './dialog/create-outbound-dispatch/create-outbound-dispatch.component';
import { DetailProductDataComponent } from '../../../../../components/dialogs/detail-product-data/detail-product-data.component';

@Component({
  selector: 'app-outbound',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './outbound.component.html',
  styleUrl: './outbound.component.css'
})
export class OutboundComponent implements OnInit {

  stateOptions: any[] = [{ label: 'Despachos', value: true }, { label: 'Salidas', value: false }];
  value: boolean = true;

  constructor(
    public dialog: MatDialog,
    public outboundService: OutboundService,
  ) {
  }

  ngOnInit(): void {
    if (this.value) { this.outboundService.getOutboundDispatch() }
    else { this.outboundService.getOutbound() }
  }

  openOutboundModal() {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(CreateOutboundComponent, {
      width: '1300px', // Especifica el ancho del modal
      height: '600px', // (Opcional) Especifica la altura del modal
    })

    dialogRef.afterClosed().subscribe(() => {
      // this.outboundService.getOutbound()
    });
  }

  openDetailViewModal(elementoList: any[], nombre: string) {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(DetailProductDataComponent, { data: { elementoList, nombre }, })
    dialogRef.afterClosed().subscribe(() => {
      // this.barbershopService.getDates()
    });
  }

  openOutboundDispatchModal() {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(CreateOutboundDispatchComponent, {
      width: '1300px', // Especifica el ancho del modal
      height: '600px', // (Opcional) Especifica la altura del modal
    })

    dialogRef.afterClosed().subscribe(() => {
      this.outboundService.getOutboundDispatch()
    });
  }
}
