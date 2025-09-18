import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { BarbershopService } from '../../service/barbershop.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { SnackBarService } from '../../../../../services/snackBar.service';
import { MatDialog } from '@angular/material/dialog';
import 'dayjs/locale/es';
import { CalendarEvent, CalendarModule } from 'angular-calendar';
import { Subject } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../configurations/configurationOptions/clients/services/clients.service';
import { BabersService } from '../../../configurations/configurationOptions/barbers/services/barbers.service';
import { MessageService } from 'primeng/api';
import { ViewDetailDateComponent } from '../../dialog/view-detail-date/view-detail-date.component';
import { PersonGetI } from '../../../../interface/general.Interface';

@Component({
  selector: 'app-dates',
  imports: [PrimeComponentsModules, ModulesImports, CalendarModule],
  templateUrl: './dates.component.html',
  styleUrl: './dates.component.css',
  providers: [MessageService]
})
export class DatesComponent implements OnInit {

  filterForm!: FormGroup
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  people: any[] = [];
  dates: any[] = []
  stateOptions = [
    { id: 0, name: 'Todos' },
    { id: 3, name: 'Reservado' },
    { id: 5, name: 'En proceso' },
    { id: 6, name: 'Cancelado' },
    { id: 7, name: 'Completado' },
  ];

  constructor(
    public fb: FormBuilder,
    public dialog: MatDialog,
    public barbershopService: BarbershopService,
    private messageService: MessageService,
    private snackBar: SnackBarService,
    public barberService: BabersService,
    public clientService: ClientService,
    public snackbarService: SnackBarService,
    private requestHelpers: RequestHelperService,
  ) {
    this.filterForm = this.fb.group({
      name: new FormControl(''),
      state: new FormControl(''),
    })
  }

  private injector = inject(EnvironmentInjector);

  ngOnInit(): void {
    this.clientService.getClients()
    this.barberService.getBarbers()

    this.barbershopService.getDatesWeekly();
    this.injector.runInContext(() => {
      effect(() => {
        const barberos = this.barberService.barbers();
        const clientes = this.clientService.clients();

        this.people = [...clientes, ...barberos];

        this.dates = this.barbershopService.datesWk();

        this.events = this.dates.map((item: any) => {
          const start = new Date(`${item.start_time}`);
          const end = new Date(`${item.end_time}`);

          let eventColor = { primary: '#2563eb', secondary: '#2563eb' };
          switch ((item.status || '').toLowerCase()) {
            case 'reservado':
              eventColor = { primary: '#f59e0b', secondary: '#f59e0b' };
              break;
            case 'en proceso':
              eventColor = { primary: '#3b82f6', secondary: '#3b82f6' };
              break;
            case 'cancelado':
              eventColor = { primary: '#ef4444', secondary: '#ef4444' };
              break;
            case 'completado':
              eventColor = { primary: '#10b981', secondary: '#10b981' };
              break;
          }

          return {
            start,
            end,
            title: `${item.client_name} con ${item.barber_name} - ${item.services[0].name}`,
            color: eventColor,
            client_name: item.client_name,
            barber_name: item.barber_name,
            services: item.services,
            cliente: {},
            date: item.appointment_date,
            status: item.status,
            client_id: item.client_id,
            created: item.created_at,
            created_by: item.created_by,
            updated: item.updated_at,
          } as CalendarEvent & {
            client_name: string;
            barber_name: string;
            services: any[];
            cliente: PersonGetI,
            date: Date;
            status: string,
            client_id: number,
            created: Date,
            created_by: string,
            updated: Date,
          };
        });

        this.refresh.next();
      });
    });
  }

  filterDate(): void {
    const formValue = this.filterForm.value;
    const selectedPerson = formValue.name;
    const selectedStateName: string | null =
      typeof formValue.state === 'string' ? formValue.state : null;

    let citas = this.barbershopService.dates();

    // ✅ Filtrar por persona
    if (selectedPerson) {
      const fullName = `${selectedPerson.first_name} ${selectedPerson.last_name}`.toLowerCase();
      citas = citas.filter((cita: any) =>
        cita.client_name.toLowerCase().includes(fullName) ||
        cita.barber_name.toLowerCase().includes(fullName)
      );
    }

    // ✅ Filtrar por estado
    if (selectedStateName && selectedStateName.toLowerCase() !== 'todos') {
      citas = citas.filter(
        (cita: any) => (cita.status || '').toLowerCase() === selectedStateName.toLowerCase()
      );
    }

    // ✅ Mensajes cuando no hay resultados
    if (citas.length === 0) {
      if (selectedPerson && selectedStateName && selectedStateName.toLowerCase() !== 'todos') {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay citas esta semana para ${selectedPerson.first_name} ${selectedPerson.last_name} con estado "${selectedStateName}"`,
          life: 4000
        });
      } else if (selectedPerson) {
        const etiqueta = selectedPerson.role_id === 2 ? 'barbero' :
          selectedPerson.role_id === 3 ? 'cliente' : '';
        const texto = etiqueta
          ? `No hay citas esta semana para el ${etiqueta} ${selectedPerson.first_name} ${selectedPerson.last_name}`
          : `No hay citas esta semana para ${selectedPerson.first_name} ${selectedPerson.last_name}`;
        this.messageService.add({ severity: 'info', summary: 'Info', detail: texto, life: 4000 });
      } else if (selectedStateName && selectedStateName.toLowerCase() !== 'todos') {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay citas esta semana con el estado "${selectedStateName}"`,
          life: 4000
        });
      }
    }

    // ✅ Mapear al calendario con color según estado y datos completos
    this.events = citas.map((item: any) => {
      const start = new Date(item.start_time);
      const end = new Date(item.end_time);

      let eventColor = { primary: '#2563eb', secondary: '#2563eb' }; // azul por defecto
      switch ((item.status || '').toLowerCase()) {
        case 'reservado':
          eventColor = { primary: '#f59e0b', secondary: '#f59e0b' }; // amarillo
          break;
        case 'en procesos':
          eventColor = { primary: '#3b82f6', secondary: '#3b82f6' }; // azul
          break;
        case 'cancelado':
          eventColor = { primary: '#ef4444', secondary: '#ef4444' }; // rojo
          break;
        case 'completado':
          eventColor = { primary: '#10b981', secondary: '#10b981' }; // verde
          break;
      }

      return {
        start,
        end,
        title: `${item.client_name} con ${item.barber_name} - ${item.services?.[0]?.name ?? ''} (${item.status})`,
        color: eventColor,
        client_name: item.client_name,
        barber_name: item.barber_name,
        services: item.services
      } as CalendarEvent & {
        client_name: string;
        barber_name: string;
        services: any[];
      };
    });

    this.refresh.next();
  }

  handleEventClick(event: any): void {
    let cliente = this.clientService.clients().find(i =>  i.id == event.client_id )
    event.cliente = cliente

    const dialogRef = this.dialog.open(ViewDetailDateComponent, {data: event})
      dialogRef.afterClosed().subscribe(() => {
    });
  }
}
