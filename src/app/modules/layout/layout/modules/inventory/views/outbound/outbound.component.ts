import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { MatDialog } from '@angular/material/dialog';
import { OutboundService } from './service/outbound.service';
import { CreateOutboundComponent } from './dialog/create-outbound/create-outbound.component';
import { CreateOutboundDispatchComponent } from './dialog/create-outbound-dispatch/create-outbound-dispatch.component';
import { DetailProductDataComponent } from '../../../../../components/dialogs/detail-product-data/detail-product-data.component';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { NoDataComponent } from '../../../../../components/no-data/no-data.component';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DetailDataComponent } from '../../../../../components/dialogs/detail-data/detail-data.component';
import { OutboundGetDispacthI, OutboundGetI } from './interface/outbound.interface';
import { SnackBarService } from '../../../../../services/snackBar.service';

@Component({
  selector: 'app-outbound',
  imports: [PrimeComponentsModules, ModulesImports, MaterialComponents, NoDataComponent],
  templateUrl: './outbound.component.html',
  styleUrl: './outbound.component.css',
  providers: [MessageService]
})
export class OutboundComponent implements OnInit {

  OutboundFilterForm: FormGroup;
  stateOptions: any[] = [
    { label: 'Despachos', value: true },
    { label: 'Salidas', value: false }
  ];
  outbounds: any[] = []
  value: boolean = true;
  private injector = inject(EnvironmentInjector);

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: SnackBarService,
    public outboundService: OutboundService,
    private messageService: MessageService,
  ) {
    this.OutboundFilterForm = this.fb.group({
      date: new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.outboundService.getOutboundDispatch()
    this.outboundService.getOutbound()

    this.injector.runInContext(() => {
      effect(() => {
        if (this.value) {
          this.outbounds = this.outboundService.outboundDis();
        } else {
          this.outbounds = this.outboundService.outbound();
        }
      });
    });
  }

  selectTypeOutbound() {
    this.outbounds = this.value ? this.outboundService.outboundDis() : this.outboundService.outbound();
    this.filterOutbound();
  }

  filterOutbound(): void {
    const formValue = this.OutboundFilterForm.value;
    const selectedDateRange = formValue.date;

    // 🔹 Seleccionar el array según el tipo de salida
    let filteredOutbounds = this.value
      ? [...this.outboundService.outboundDis()]
      : [...this.outboundService.outbound()];

    // 🔹 Filtrar por rango de fecha
    if (selectedDateRange && selectedDateRange[1] != null) {
      const [startDate, endDate] = selectedDateRange;
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);

      filteredOutbounds = filteredOutbounds.filter((item: any) => {
        // 👇 aquí revisa la propiedad de fecha según el tipo de salida
        const dateField = this.value ? item.dispatch_date : item.exit_date;
        const itemDate = new Date(dateField).getTime();
        return itemDate >= start && itemDate <= end;
      });
    }

    this.outbounds = filteredOutbounds;

    // 🔹 Mostrar mensaje si no hay resultados
    if (this.outbounds.length === 0) {
      if (selectedDateRange && selectedDateRange[1] != null) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay ${this.value ? 'despachos' : 'salidas'} dentro del rango de fechas seleccionado`,
          life: 4000
        });
      } else {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay ${this.value ? 'despachos' : 'salidas'} disponibles`,
          life: 4000
        });
      }
    }
  }

  openOutboundModal(outbound: OutboundGetI | null = null) {
    const dialogRef = this.dialog.open(CreateOutboundComponent, { data: outbound })

    dialogRef.afterClosed().subscribe(() => {
      this.outboundService.getOutbound()
      this.outbounds = this.value ? this.outboundService.outboundDis() : this.outboundService.outbound()
    });
  }

  openDetailViewModal(elementoList: any[], nombre: string, entidad: string, icon: string) {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(DetailDataComponent, { data: { elementoList, entidad, nombre, icon }, })
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  openOutboundDispatchModal(outbound: OutboundGetDispacthI | null = null) {
    const dialogRef = this.dialog.open(CreateOutboundDispatchComponent, { data: outbound })

    dialogRef.afterClosed().subscribe(() => {
      this.outboundService.getOutboundDispatch()
    });
  }
  async removeOutBound(idInbound: number) {
    let closeAccount: boolean = await this.snackBar.snackbarConfirmation('Estas seguro de eliminar la cita?', '')

    if (closeAccount) {
      this.outboundService.deleteOutbound(idInbound).subscribe((res: any) => {
        if (res.errorCode == 200) {
          this.snackBar.snackbarSuccess()
          this.outbounds = this.value ? this.outboundService.outboundDis() : this.outboundService.outbound();
        }
      })
    }
  }
}
