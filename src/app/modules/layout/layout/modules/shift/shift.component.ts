import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { NoDataComponent } from '../../../components/no-data/no-data.component';
import { shifI } from './interface/shif.interface';
import { ShiftService } from './services/shif.service';
import { BabersService } from '../configurations/configurationOptions/barbers/services/barbers.service';
import { PersonGetI } from '../../interface/general.Interface';

@Component({
  selector: 'app-shift',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports, NoDataComponent],
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.css'
})
export class ShiftComponent implements OnInit {


  barberSchedule: shifI[] = [];
  barberSelected!: PersonGetI;

  activeDays: string = '0/0';
  totalHours: number = 0;

  private injector = inject(EnvironmentInjector);

  constructor(
    public shifService: ShiftService,
    public barberService: BabersService,
  ) { }

  ngOnInit(): void {
    this.barberService.getBarbers();
  }

  clearForm(): void {
    this.barberSelected = undefined as any; // limpia el ngModel
    this.barberSchedule = []; // limpia la tabla
  }

  getShiftBarber() {
    this.shifService.getShiftByBarber(this.barberSelected.id);

    this.injector.runInContext(() => {
      effect(() => {
        this.barberSchedule = this.shifService.shift();

        this.calculateScheduleInfo();
      });
    });
  }

  private calculateScheduleInfo() {
    const totalDays = this.barberSchedule.length;
    const active = this.barberSchedule.filter(d => d.status_id === 1);

    this.activeDays = `${active.length}/${totalDays}`;

    this.totalHours = active.reduce((sum, d) => {
      return sum + this.getHours(d.start_time, d.end_time);
    }, 0);
  }

  public getHours(start: string, end: string): number {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return (endMinutes - startMinutes) / 60;
  }

}
