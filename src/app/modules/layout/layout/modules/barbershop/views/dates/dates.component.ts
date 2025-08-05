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
import { PaymentComponent } from '../../../sale/dialog/payment/payment.component';

@Component({
  selector: 'app-dates',
  imports: [PrimeComponentsModules, ModulesImports, CalendarModule],
  templateUrl: './dates.component.html',
  styleUrl: './dates.component.css'
})
export class DatesComponent implements OnInit {

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();

  // citas: any[] = [
  //   {

  //     appointment_date: "2025-07-18",
  //     barber_name: "Erick Perez",
  //     client_id: 1,
  //     client_name: "Lis Maria",
  //     created_at: "2025-07-18T04:41:50.000000Z",
  //     created_by: "Erick Perez",
  //     end_time: "14:15:00",
  //     id: 1,
  //     services: ['Corte de cabello', 'Masaje'],
  //     start_time: "14:12:00",
  //     status: "Reservado",
  //     updated_at: "2025-07-18T04:41:50.000000Z"
  //   }
  // ]

  constructor(
    public dialog: MatDialog,
    public barbershopService: BarbershopService,
    private snackBar: SnackBarService,
    public snackbarService: SnackBarService,
    private requestHelpers: RequestHelperService,
  ) { }

  private injector = inject(EnvironmentInjector);

  ngOnInit(): void {
    // Ejecuta la llamada para llenar el signal
    this.barbershopService.getDates();

    // ✅ Usa runInContext para ejecutar effect de manera segura
    this.injector.runInContext(() => {
      effect(() => {
        const citas = this.barbershopService.dates();

        this.events = citas.map((item: any) => {
          const start = new Date(`${item.appointment_date}T${item.start_time}`);
          const end = new Date(`${item.appointment_date}T${item.end_time}`);

          return {
            start,
            end,
            title: `${item.client_name} con ${item.barber_name} - ${item.services.join(', ')}`,
            // color: {
            //   primary: '#374151',
            //   secondary: '#fff'
            // }
          } as CalendarEvent;
        });

        this.refresh.next(); // actualiza vista
      });
    });
  }



  handleEventClick(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '1300px',
    }) //, { data: { elementoList, nombre }, }
    dialogRef.afterClosed().subscribe(() => {
    });
  }

}
