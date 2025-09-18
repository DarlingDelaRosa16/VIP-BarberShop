import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { BabersService } from '../../../configurations/configurationOptions/barbers/services/barbers.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BabersReportService } from '../../service/reportbarber.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { SnackBarService } from '../../../../../services/snackBar.service';
import { NoDataComponent } from '../../../../../components/no-data/no-data.component';
import { NgxPrintModule } from 'ngx-print';

@Component({
  selector: 'app-barbers-reports',
  imports: [PrimeComponentsModules, ModulesImports, NoDataComponent, NgxPrintModule],
  templateUrl: './barbers-reports.component.html',
  styleUrl: './barbers-reports.component.css'
})
export class BarbersReportsComponent implements OnInit {

  reportBarberForm: FormGroup;
  rangeDates!: Date[];
  data!: any

  constructor(
    public fb: FormBuilder,
    public barberService: BabersService,
    private requestHelpers: RequestHelperService,
    public barberReportService: BabersReportService,
    public snackbarService: SnackBarService,
  ) {
    this.reportBarberForm = this.fb.group({
      barber_id: new FormControl(0, Validators.required),
      // fecha_inicio: new FormControl('', Validators.required),
      // fecha_fin: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
    this.barberService.getBarbers()
  }

  value: string = '';

  preSetDates: any[] = [
    { label: 'Semana', value: 'semana' },
    { label: 'Quincena', value: 'quincena' },
    { label: 'Mes', value: 'mes',} // constant: true
  ];

  findReport() {
    const formattedDate1 = new Date(this.rangeDates[0]).toISOString().split('T')[0];
    const formattedDate2 = new Date(this.rangeDates[1]).toISOString().split('T')[0];

    const barber = {
      barber_id: this.reportBarberForm.value.barber_id.id,
      fecha_inicio: formattedDate1,
      fecha_fin: formattedDate2
    }

    this.value = ''

    this.barberReportService.getBarbersReport(barber).subscribe((res: any) => {
      if (res.data) {
        this.data = res.data
        console.log(JSON.stringify(res.data));

        this.snackbarService.snackbarSuccess()
      }
      // this.requestHelpers.handleResponse(res, () => {console.log(res);},)
    })
  }

  clearReportFilters(): void {
  this.reportBarberForm.reset(); // limpia todos los formControls
  this.rangeDates = undefined as any;        // limpia el rango de fechas
  this.data = undefined as any;        // limpia el rango de fechas
}

  findBySetDate(){
    const barber = {
      barber_id: this.reportBarberForm.value.barber_id.id,
      filtro: this.value
    }

    this.barberReportService.getBarbersReportSetDate(barber).subscribe((res: any) => {
      if (res.data) {
        console.log(res);

        this.data = res.data
        this.snackbarService.snackbarSuccess()
      }
      // this.requestHelpers.handleResponse(res, () => {console.log(res);},)
    })
  }
}
