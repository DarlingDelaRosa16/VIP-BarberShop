import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { NoDataComponent } from '../../../components/no-data/no-data.component';
import { shifI } from './interface/shif.interface';
import { ShiftService } from './services/shif.service';
import { BabersService } from '../configurations/configurationOptions/barbers/services/barbers.service';
import { PersonGetI } from '../../interface/general.Interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '../../../services/snackBar.service';
import { RequestHelperService } from '../../../services/requestHelper.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-shift',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports, NoDataComponent],
  templateUrl: './shift.component.html',
  styleUrl: './shift.component.css'
})
export class ShiftComponent implements OnInit {
  barberSchedule: shifI[] = [];
  barberLunchSchedule!: {errorCode: string, lunch_end: string, lunch_start: string}
  barberSelected!: PersonGetI;

  activeDays: string = '0/0';
  totalHours: number = 0;

  shiftForm!: FormGroup;
  shiftLunchForm!: FormGroup;

  private injector = inject(EnvironmentInjector);

  constructor(
    private fb: FormBuilder,
    public shifService: ShiftService,
    public barberService: BabersService,
    public snackBar: SnackBarService,
    public requestHelperService: RequestHelperService,
  ) {

    this.shiftForm = this.fb.group({
      schedules: this.fb.array([]) // cada día con start y end
    });

    this.shiftLunchForm = this.fb.group({
      barber_id: new FormControl(0),
      lunch_start: new FormControl('', Validators.required),
      lunch_end: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.barberService.getBarbers();
  }

  get schedules(): FormArray {
    return this.shiftForm.get('schedules') as FormArray;
  }

  clearForm(): void {
    this.barberSelected = undefined as any;
    this.barberSchedule = [];
    this.schedules.clear();
  }

  getShiftBarber() {
    this.shifService.getShiftByBarber(this.barberSelected.id);
    this.shifService.getShiftLunchByBarber(this.barberSelected.id);

    this.injector.runInContext(() => {
      effect(() => {
        this.barberLunchSchedule = this.shifService.shiftLunch();
        this.barberSchedule = this.shifService.shift();
        console.log(this.barberLunchSchedule);

        this.shiftLunchForm.patchValue({
          lunch_start: this.barberLunchSchedule.lunch_start,
          lunch_end: this.barberLunchSchedule.lunch_end
        })

        this.buildForm(this.barberSchedule); // construye el formulario
        this.calculateScheduleInfo();
      });
    });
  }

  private buildForm(data: shifI[]) {
    this.schedules.clear();

    data.forEach(d => {
      this.schedules.push(this.fb.group({
        day_id: [d.day_id],
        day_name: [d.day_name],
        status_id: [d.status_id],
        id: [d.id],
        // convertir "09:00:00" → Date
        start_time: [this.toDate(d.start_time)],
        end_time: [this.toDate(d.end_time)]
      }));
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

  private toDate(time: string): Date | null {
    if (!time) return null;
    const [h, m, s] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, s || 0, 0);
    return date;
  }

  // Convierte Date a "HH:mm:ss" antes de enviar
  private toTimeString(date: Date): string {
    if (!date) return '';
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  public getHours(start: any, end: any): number {
    if (!start || !end) return 0;

    let sh: number, sm: number, eh: number, em: number;

    if (start instanceof Date && end instanceof Date) {
      sh = start.getHours();
      sm = start.getMinutes();
      eh = end.getHours();
      em = end.getMinutes();
    } else {
      // fallback si aún viene como string
      [sh, sm] = start.split(':').map(Number);
      [eh, em] = end.split(':').map(Number);
    }

    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    return (endMinutes - startMinutes) / 60;
  }

  onToggleChange(row: FormGroup) {
    this.snackBar.snackbarLouder(true)

    this.shifService.editStatus(row.value.id).subscribe((res) => {
      this.requestHelperService.handleResponse(res, () => this.getShiftBarber())

    })
  }

  public save() {
    const payload = {
      schedules: this.schedules.value.map((s: any) => ({
        day_id: s.day_id,
        start_time: this.toTimeString(s.start_time),
        end_time: this.toTimeString(s.end_time),
      }))
    };

    this.snackBar.snackbarLouder(true)

    this.shifService.putShift(this.barberSelected.id, payload).subscribe((res) => {
      this.requestHelperService.handleResponse(res, () => this.clearForm())
    })
  }

}
