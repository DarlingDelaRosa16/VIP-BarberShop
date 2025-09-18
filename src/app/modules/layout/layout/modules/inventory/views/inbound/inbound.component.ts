import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { InboundService } from './services/inbound.service';
import { NoDataComponent } from '../../../../../components/no-data/no-data.component';
import { SnackBarService } from '../../../../../services/snackBar.service';
import { DetailDataComponent } from '../../../../../components/dialogs/detail-data/detail-data.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateInboundComponent } from './dialogs/create-inbound/create-inbound.component';
import { ViewDetailsInboundComponent } from './dialogs/view-details-inbound/view-details-inbound.component';
import { inboundI } from './interface/inbound.interface';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inbound',
  imports: [PrimeComponentsModules, ModulesImports, MaterialComponents, NoDataComponent],
  templateUrl: './inbound.component.html',
  styleUrl: './inbound.component.css',
  providers: [MessageService]
})
export class InboundComponent implements OnInit {

  rangeDates!: Date[];
  inbound: inboundI[] = []
  InboundFilterForm: FormGroup;
  filteredInbound: inboundI[] = []
  private injector = inject(EnvironmentInjector);

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: SnackBarService,
    public inboundService: InboundService,
    private messageService: MessageService,
  ) {
    this.InboundFilterForm = this.fb.group({
      invoice: new FormControl(null),
      date: new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.inboundService.getInbound()

    this.injector.runInContext(() => {
      effect(() => {
        this.inbound = this.inboundService.inbound();
      });
    });
  }

  clearForm() {
    this.rangeDates = []
    this.InboundFilterForm.reset()
    this.inbound = this.inboundService.inbound();
  }

  showDetail(inbound: inboundI) {
    const dialogRef = this.dialog.open(ViewDetailsInboundComponent, {
      data: inbound,
      maxHeight: '92vh',
      panelClass: 'custom-dialog-container'
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  filterInbound(): void {
    const formValue = this.InboundFilterForm.value;
    const selectedInvoice: string | null = formValue.invoice
      ? String(formValue.invoice).trim()
      : null;

    let filteredInbound = [...this.inboundService.inbound()];

    if (selectedInvoice) {
      filteredInbound = filteredInbound.filter((entrada: any) =>
        (entrada.invoice_number || '')
          .toLowerCase()
          .includes(selectedInvoice.toLowerCase())
      );
    }

    if (this.rangeDates && this.rangeDates.length === 2 && this.rangeDates[1] != null) {
      const [startDate, endDate] = this.rangeDates;
      if (startDate && endDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);

        filteredInbound = filteredInbound.filter((entrada: any) => {
          const entryDate = new Date(entrada.entry_date).getTime();
          return entryDate >= start && entryDate <= end;
        });
      }
    }

    this.inbound = filteredInbound;

    if (filteredInbound.length === 0) {
      if (selectedInvoice && this.rangeDates?.length === 2 && this.rangeDates[1] != null) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay entradas con la factura "${selectedInvoice}" en el rango de fechas seleccionado`,
          life: 4000
        });
      } else if (selectedInvoice) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay entradas con el número de factura "${selectedInvoice}"`,
          life: 2700
        });
      } else if (this.rangeDates?.length === 2 && this.rangeDates[1] != null) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay entradas dentro del rango de fechas seleccionado`,
          life: 2900
        });
      }
    }
  }

  openCreateInboundModal(inbound: inboundI | null = null) {
    const dialogRef = this.dialog.open(CreateInboundComponent, {data: inbound})

    dialogRef.afterClosed().subscribe(() => {
      this.inboundService.getInbound()
    });
  }

  openDetailViewModal(elementoList: any[], nombre: string, entidad: string, icon: string) {
    const dialogRef = this.dialog.open(DetailDataComponent, { data: { elementoList, entidad, nombre, icon }, })
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  async removeInBound(idInbound: number) {
    let closeAccount: boolean = await this.snackBar.snackbarConfirmation('Estas seguro de eliminar la cita?', '')

    if (closeAccount) {
      this.inboundService.deleteInbound(idInbound).subscribe((res: any) => {
        if (res.errorCode == 200) {
          this.snackBar.snackbarSuccess()
          this.inboundService.getInbound()
        }
      })
    }
  }
}
