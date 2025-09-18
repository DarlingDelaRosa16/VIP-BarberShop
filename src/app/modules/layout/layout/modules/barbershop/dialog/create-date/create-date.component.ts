import { Component, effect, EnvironmentInjector, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BabersService } from '../../../configurations/configurationOptions/barbers/services/barbers.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { SystemInformationService } from '../../../../../services/general.service';
import { BarbershopService } from '../../service/barbershop.service';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { ClientService } from '../../../configurations/configurationOptions/clients/services/clients.service';
import { ServicesService } from '../../../configurations/configurationOptions/services/services/services.service';
import { BarberSlots } from '../../../configurations/configurationOptions/barbers/interface/barbers.interface';
import { ServiceGetI } from '../../../configurations/configurationOptions/services/interface/services.interface';
import { SnackBarService } from '../../../../../services/snackBar.service';
import { DatesGetI, DatesGetToSetI } from '../../interface/barbershop.interface';

@Component({
  selector: 'app-create-date',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './create-date.component.html',
  styleUrl: './create-date.component.css'
})
export class CreateDateComponent implements OnInit {

  datesForm: FormGroup;
  hoursRange: { start_time: string, end_time: string }[] = []
  loading: boolean = false

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: DatesGetToSetI ,
    public fb: FormBuilder,
    public barbershopService: BarbershopService,
    public clientService: ClientService,
    public snackBar: SnackBarService,
    public barberService: BabersService,
    public serviceService: ServicesService,
    private requestHelpers: RequestHelperService,
    public systemInformationService: SystemInformationService,
    private dialogRef: MatDialogRef<CreateDateComponent>,

  ) {

    this.datesForm = this.fb.group({
      id: new FormControl(0),
      client_id: new FormControl(0, Validators.required),
      barber_id: new FormControl(0, Validators.required),
      appointment_date: new FormControl('', Validators.required),
      start_time: new FormControl(0, Validators.required),
      end_time: new FormControl(0, Validators.required),
      services: new FormControl('', Validators.required),
      selectedRange: new FormControl(null, Validators.required)
    })
  }

  private injector = inject(EnvironmentInjector);

  ngOnInit(): void {
    this.serviceService.getServices()
    this.clientService.getClients()
    this.barberService.getBarbers()

    if (this.elements != null) {
      this.injector.runInContext(() => {
        effect(() => {
          const allServices = this.serviceService.services();
          if (allServices.length > 0) {
            this.setDataDates();
          }
        })
      });
    }
  }

  setDataDates() {
    if (!this.elements) return;

    // Buscar el cliente completo según el id
    const client = this.clientService.clients().find(c => c.id === this.elements.client_id) || null;

    // Buscar el barbero completo según el id
    const barber = this.barberService.barbers().find(b => `${b.first_name} ${b.last_name}` === this.elements.barber_name) || null;

    // Mapear los servicios a los objetos completos de ServiceService
    const allServices = this.serviceService.services();

    const services = this.elements.services?.map((s: any) => {
      return allServices.find(as => as.name === s.name) || s; // si no hay id, dejar el objeto que llega
    }) || [];

    // Convertir la fecha a objeto Date para el datepicker
    const appointment_date = new Date(this.elements.appointment_date);

    this.datesForm.reset({
      id: this.elements.id,
      client_id: client,
      barber_id: barber,
      appointment_date: appointment_date,
      start_time: this.elements.start_time,
      end_time: this.elements.end_time,
      services: services,
      selectedRange: {
        start_time: this.elements.start_time,
        end_time: this.elements.end_time
      }
    });
  }

  clearForm() {
    this.datesForm.reset()
    this.hoursRange = []
  }

  findTimeSlots() {
    if (this.datesForm.value.appointment_date.length == 0 || this.datesForm.value.barber_id.length == 0) {
      this.snackBar.snackbarError('Es necesario completar los campos de fecha y barbero para buscar un horario disponible.', 5000)
    }

    let services: ServiceGetI[] = this.datesForm.value.services
    const formattedDate = new Date(this.datesForm.value.appointment_date).toISOString().split('T')[0];
    const duration = services.reduce((acc, service) => acc + service.duration, 0);

    const dataSlots: BarberSlots = {
      barber_id: this.datesForm.value.barber_id,
      date: formattedDate,
      duration: JSON.stringify(duration)
    }

    this.loading = true
    this.barberService.getAvaliableSlotsBarbers(dataSlots).subscribe((res: any) => {
      this.loading = false
      this.hoursRange = res.data
    })
  }

  postDates() {
    this.barbershopService.postDates(this.datesForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.datesForm)
    })
  }

  putDates() {
    this.barbershopService.putDates(this.datesForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.datesForm)
    })
  }

  saveChanges() {

    const range = this.datesForm.value.selectedRange;
    const services = this.datesForm.value.services;
    const formattedDate = new Date(this.datesForm.value.appointment_date).toISOString().split('T')[0];

    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    };

    this.datesForm.patchValue({
      start_time: formatTime(range.start_time),
      end_time: formatTime(range.end_time),
      appointment_date: formattedDate,
      services: services.map((service: ServiceGetI) => service.id),
    })

    let form = this.datesForm.value

    this.datesForm.patchValue({
      client_id: form.client_id.id,
      barber_id: form.barber_id.id
    })

    this.requestHelpers.saveChanges(() => this.postDates(), () => this.putDates(), this.datesForm.value.id, this.datesForm)
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
