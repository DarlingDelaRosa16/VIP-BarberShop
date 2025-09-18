import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { BarbershopService } from '../../service/barbershop.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateDateComponent } from '../../dialog/create-date/create-date.component';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { SnackBarService } from '../../../../../services/snackBar.service';
import { DetailDataComponent } from '../../../../../components/dialogs/detail-data/detail-data.component';
import { MenuItem, MessageService } from 'primeng/api';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { NoDataComponent } from '../../../../../components/no-data/no-data.component';
import { PaymentComponent } from '../../../sale/dialog/payment/payment.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatesGetI, DatesSetDetailViewI } from '../../interface/barbershop.interface';
import { Router } from '@angular/router';
import { CalendarCommonModule } from "angular-calendar";
import { ClientService } from '../../../configurations/configurationOptions/clients/services/clients.service';
import { BabersService } from '../../../configurations/configurationOptions/barbers/services/barbers.service';
import { ViewDetailDateComponent } from '../../dialog/view-detail-date/view-detail-date.component';

@Component({
  selector: 'app-list-dates',
  imports: [PrimeComponentsModules, ModulesImports, MaterialComponents, NoDataComponent, CalendarCommonModule],
  templateUrl: './list-dates.component.html',
  styleUrl: './list-dates.component.css',
  providers: [MessageService]
})
export class ListDatesComponent implements OnInit {

  DatesFilterForm: FormGroup;
  people: any[] = [];
  private injector = inject(EnvironmentInjector);
  dates: DatesGetI[] = []
  rangeDates!: Date[];
  stateMenu: boolean = false

  stateOptions = [
    { id: 0, name: 'Todos' },
    { id: 3, name: 'Reservado', color: { primary: '#f59e0b', secondary: '#f59e0b' } },
    { id: 5, name: 'En proceso', color: { primary: '#3b82f6', secondary: '#3b82f6' } },
    { id: 6, name: 'Cancelado', color: { primary: '#ef4444', secondary: '#ef4444' } },
    { id: 7, name: 'Completado', color: { primary: '#10b981', secondary: '#10b981' } },
  ];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SnackBarService,
    public barberService: BabersService,
    public clientService: ClientService,
    private messageService: MessageService,
    public barbershopService: BarbershopService,
    private requestHelpers: RequestHelperService,
  ) {

    this.DatesFilterForm = this.fb.group({
      name: new FormControl(null),
      date: new FormControl(null),
      state: new FormControl(null),
    })
  }

  ngOnInit(): void {
    if (this.barbershopService.dates().length == 0) { this.barbershopService.getDates() }
    if (this.barberService.barbers().length == 0) { this.barberService.getBarbers() }
    if (this.clientService.clients().length == 0) { this.clientService.getClients() }

    this.injector.runInContext(() => {
      effect(() => {
        this.dates = this.barbershopService.dates();
        const barberos = this.barberService.barbers();
        const clientes = this.clientService.clients();

        this.people = [...clientes, ...barberos];
      });
    });
  }

  clearForm() {
    this.DatesFilterForm.reset()
    this.rangeDates = []
    this.dates = this.barbershopService.dates();
  }

  filterDate(): void {
    const formValue = this.DatesFilterForm.value;
    const selectedPerson = formValue.name;
    const selectedStateName: string | null = formValue.state
      ? String(formValue.state)
      : null;

    let filteredDates = [...this.barbershopService.dates()];

    // 🔹 Filtrar por persona
    if (selectedPerson) {
      const fullName = `${selectedPerson.first_name} ${selectedPerson.last_name}`.toLowerCase();
      filteredDates = filteredDates.filter((cita: any) =>
        cita.client_name.toLowerCase().includes(fullName) ||
        cita.barber_name.toLowerCase().includes(fullName)
      );
    }

    // 🔹 Filtrar por estado
    if (selectedStateName && selectedStateName.toLowerCase() !== 'todos') {
      filteredDates = filteredDates.filter(
        (cita: any) => (cita.status || '').toLowerCase() === selectedStateName.toLowerCase()
      );
    }

    // 🔹 Filtrar por rango de fecha
    if (this.rangeDates && this.rangeDates[1] != null) {
      const [startDate, endDate] = this.rangeDates;
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);

      filteredDates = filteredDates.filter((cita: any) => {
        const citaDate = new Date(cita.appointment_date).getTime();
        return citaDate >= start && citaDate <= end;
      });
    }

    this.dates = filteredDates;

    // 🔹 Mensajes si no hay resultados
    if (this.dates.length === 0) {
      if (selectedPerson && selectedStateName && selectedStateName.toLowerCase() !== 'todos') {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay citas para ${selectedPerson.first_name} ${selectedPerson.last_name} con estado "${selectedStateName}"`,
          life: 4000
        });
      } else if (selectedPerson) {
        const etiqueta = selectedPerson.role_id === 2 ? 'barbero' :
          selectedPerson.role_id === 3 ? 'cliente' : '';
        const texto = etiqueta
          ? `No hay citas para el ${etiqueta} ${selectedPerson.first_name} ${selectedPerson.last_name}`
          : `No hay citas para ${selectedPerson.first_name} ${selectedPerson.last_name}`;
        this.messageService.add({ severity: 'info', summary: 'Info', detail: texto, life: 4000 });
      } else if (selectedStateName && selectedStateName.toLowerCase() !== 'todos') {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay citas con el estado "${selectedStateName}"`,
          life: 4000
        });
      } else if (this.rangeDates && this.rangeDates[1] != null) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay citas dentro del rango de fechas seleccionado`,
          life: 4000
        });
      }
    }
  }

  goToVentaProductos(dates: any) {
    this.router.navigate(['/layout/ventas'], { state: { data: dates } });
  }

  openCreateDateModal(dates: DatesGetI | '') {
    const dialogRef = this.dialog.open(CreateDateComponent, { data: dates })
    dialogRef.afterClosed().subscribe(() => {
      this.barbershopService.getDates()
    });
  }

  openDetailViewModal(elementoList: any[], nombre: string, entidad: string, icon: string) {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(DetailDataComponent, { data: { elementoList, entidad, nombre, icon }, })
    dialogRef.afterClosed().subscribe(() => {
      // this.barbershopService.getDates()
    });
  }

  ViewDetailModal(event: any): void {
    let cliente = this.clientService.clients().find(i => i.id == event.client_id)
    let detalle: DatesSetDetailViewI

    detalle = {
      barber_name: event.barber_name,
      client_id: event.client_id,
      client_name: event.client_name,
      cliente: cliente!,
      color: this.stateOptions.find(s => s.name === event.status)?.color || { primary: '#ddd', secondary: '#ddd' },
      created: event.created_at,
      created_by: event.created_by,
      date: event.appointment_date,
      end: event.end_time,
      services: event.services,
      start: event.start_time,
      status: event.status,
      title: "",
      updated: event.updated_at
    }

    const dialogRef = this.dialog.open(ViewDetailDateComponent, { data: detalle })
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  changeStatusDate(idDate: number, status: number) {
    this.snackBar.snackbarLouder(true);
    this.barbershopService.putDateStatus(idDate, status).subscribe((res: any) => {
      if (res.appointment) {
        this.requestHelpers.handleResponse(res, () => this.barbershopService.getDates(),)
      }
    })
  }

  async removeDate(idDate: number) {
    let closeAccount: boolean = await this.snackBar.snackbarConfirmation('Estas seguro de eliminar la cita?', '')

    if (closeAccount) {
      this.barbershopService.deleteDateStatus(idDate).subscribe((res: any) => {
        if (res.errorCode == 200) {
          this.requestHelpers.handleResponse(res, () => this.barbershopService.getDates(), )
        }
      })
    }
  }

  payment(dates: DatesGetI) {
    const dialogRef = this.dialog.open(PaymentComponent, { data: { dates }, })
    dialogRef.afterClosed().subscribe(() => {
      this.barbershopService.getDates()
    });
  }
}
