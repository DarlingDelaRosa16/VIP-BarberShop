import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { BarbershopService } from '../../service/barbershop.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { SnackBarService } from '../../../../../services/snackBar.service';
import { MatDialog } from '@angular/material/dialog';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

@Component({
  selector: 'app-dates',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './dates.component.html',
  styleUrl: './dates.component.css'
})
export class DatesComponent implements OnInit {

  calendar: any = {}; // Mapa con días y horas
  timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  pixelsPerMinute = 1.5
  rowHeight = 60 * this.pixelsPerMinute;

  constructor(
    public dialog: MatDialog,
    public barbershopService: BarbershopService,
    private snackBar: SnackBarService,
    public snackbarService: SnackBarService,
    private requestHelpers: RequestHelperService,
    // private systemInformationService: SystemInformationService
  ) {
  }

  ngOnInit() {
    this.barbershopService.getDates()
    this.initializeCalendar();
    this.loadAppointments();
  }

  initializeCalendar() {
    this.daysOfWeek.map(day => {
      this.calendar[day] = {};

      this.timeSlots.map(slot => {
        this.calendar[day][slot] = [];
      });

    });
  }

  loadAppointments() {
    this.barbershopService.getDatesSS().subscribe((res: any) => {
      res.data.map((appo: any) => {
        const date = dayjs(appo.appointment_date);
        const dayName = this.getDayName(date.day());

        const startDateTime = dayjs(`${appo.appointment_date}T${appo.start_time}`);
        const endDateTime = dayjs(`${appo.appointment_date}T${appo.end_time}`);

        const durationMinutes = endDateTime.diff(startDateTime, 'minute');
        const offsetMinutes = startDateTime.minute(); // para el desplazamiento dentro del bloque

        // Agrega estos al objeto
        appo.duration = durationMinutes;
        appo.offset = offsetMinutes;

        // Buscar el bloque en el que cae la cita
        for (let i = 0; i < this.timeSlots.length - 1; i++) {
          const blockStart = dayjs(`${appo.appointment_date}T${this.timeSlots[i]}:00`);
          const blockEnd = dayjs(`${appo.appointment_date}T${this.timeSlots[i + 1]}:00`);

          // console.log(startDateTime.isSameOrAfter(blockStart));

          if (startDateTime.isSameOrAfter(blockStart) && startDateTime.isBefore(blockEnd)) {
            if (this.calendar[dayName] && this.calendar[dayName][this.timeSlots[i]]) {
              this.calendar[dayName][this.timeSlots[i]].push(appo);
              console.log('Agregado:', { dayName, timeSlot: this.timeSlots[i], cliente: appo.client_name });
            }
            return; // termina el loop cuando ya se insertó
          }
        }

        // Si no se encontró un bloque donde insertarlo
        console.warn('No se pudo agregar:', {
          cliente: appo.client_name,
          dayName,
          startTime: appo.start_time
        });
      });
    });
  }

  getDayName(dayNumber: number): string {
    // dayjs().day() => 0: Domingo, 1: Lunes, ..., 6: Sábado
    const map = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return map[dayNumber];
  }
}



// loadAppointments() {
//     this.barbershopService.getDatesSS().subscribe((res: any) => {

//       res.data.map((appo: any) => {

//         const date = dayjs(appo.appointment_date);
//         const dayName = this.getDayName(date.day());

//         const startHour = dayjs(`${appo.appointment_date}T${appo.start_time}`, 'HH:mm:ss').format('HH:mm');

//         if (this.calendar[dayName] && this.calendar[dayName][startHour]) {
//           this.calendar[dayName][startHour].push(appo);
//         } else {
//           console.warn('No se pudo agregar:', { dayName, startHour });
//         }
//       });
//     });
//   }
