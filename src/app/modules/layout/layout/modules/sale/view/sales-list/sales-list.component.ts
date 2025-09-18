import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { SalesService } from '../../services/sales.service';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../../configurations/configurationOptions/clients/services/clients.service';
import { DetailDataComponent } from '../../../../../components/dialogs/detail-data/detail-data.component';
import { MatDialog } from '@angular/material/dialog';
import { invoiceGetI } from '../../interface/sale.interface';
import { ShowInvoiceComponent } from '../../dialog/show-invoice/show-invoice.component';

@Component({
  selector: 'app-sales-list',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports],
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
  providers: [MessageService]
})
export class SalesListComponent implements OnInit {

  public clientSelected: any = null;   // cliente/barbero seleccionado
  public rangeDates: Date[] = [];      // fechas seleccionadas
  public paymentMethod: string | null = null; // método de pago seleccionado
  public filteredInvoices: any[] = []; // facturas filtradas
  private injector = inject(EnvironmentInjector);
  year: number = new Date().getFullYear()

  paymentMethods: any[] = [
    { method: 'Efectivo', id: 1 },
    { method: 'Tarjeta', id: 2 },
    { method: 'Transferencia', id: 3 }
  ]
  constructor(
    public dialog: MatDialog,
    public salesService: SalesService,
    public clientService: ClientService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.salesService.getInvoices()
    this.clientService.getClients();
    this.clientService.clients();

    this.injector.runInContext(() => {
      effect(() => {
        this.filteredInvoices = this.salesService.sales();
      });
    });
  }


  filterInvoices(): void {
    let filtered = [...this.salesService.sales()]; // todas las facturas originales

    // 🔹 Filtro por cliente/barbero
    if (this.clientSelected) {

      const clientName = `${this.clientSelected.first_name} ${this.clientSelected.last_name}`.toLowerCase();

      filtered = filtered.filter((factura: any) => {

        const nombreFactura = factura.client_name.toLowerCase();
        return nombreFactura.includes(clientName);
      });
    }

    // 🔹 Filtro por rango de fechas
    if (this.rangeDates && this.rangeDates.length === 2 && this.rangeDates[1] != null) {

      const [startDate, endDate] = this.rangeDates;

      if (startDate && endDate) {

        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);

        filtered = filtered.filter((factura: any) => {
          const facturaDate = new Date(factura.invoice_date).getTime();
          return facturaDate >= start && facturaDate <= end;
        });
      }
    }

    // 🔹 Filtro por método de pago
    if (this.paymentMethod) {
      filtered = filtered.filter((factura: any) =>
        factura.payment_method_id === this.paymentMethod
      );
    }

    // Asignamos los resultados
    this.filteredInvoices = filtered;

    // 🔹 Mensajes si no hay resultados
    if (filtered.length === 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin resultados',
        detail: `No hay facturas que coincidan con los filtros aplicados.`,
        life: 3000
      });
    }
  }

  openDetailViewModal(elementoList: any[], nombre: string, entidad: string, icon: string) {
    const dialogRef = this.dialog.open(DetailDataComponent, { data: { elementoList, entidad, nombre, icon }, })
    dialogRef.afterClosed().subscribe(() => { });
  }

  openViewInvoice(invoice: invoiceGetI) {
    const dialogRef = this.dialog.open(ShowInvoiceComponent, {
      data: { invoice },
      width: '850px',
      height: '92vh',
      maxWidth: '900px',
      panelClass: 'full-screen-modal'
    });
    dialogRef.afterClosed().subscribe(() => { });
  }

  // 🔹 Limpia los filtros
  clearForm(): void {
    this.clientSelected = null;
    this.rangeDates = [];
    this.paymentMethod = null;
    this.filteredInvoices = [...this.salesService.sales()];
  }
}
