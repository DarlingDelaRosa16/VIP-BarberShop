import { Component, Inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-create-date',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './create-date.component.html',
  styleUrl: './create-date.component.css'
})
export class CreateDateComponent implements OnInit {

  datesForm: FormGroup;
  hoursRange: { start_time: string, end_time: string }[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: {},
    public fb: FormBuilder,
    public barbershopService: BarbershopService,
    public clientService: ClientService,
    public barberService: BabersService,
    public serviceService: ServicesService,
    private requestHelpers: RequestHelperService,
    public systemInformationService: SystemInformationService,
    private dialogRef: MatDialogRef<CreateDateComponent>,

  ) {

    this.datesForm = this.fb.group({
      client_id: new FormControl(0, Validators.required),
      barber_id: new FormControl(0, Validators.required),
      appointment_date: new FormControl('', Validators.required),
      start_time: new FormControl(0, Validators.required),
      end_time: new FormControl(0, Validators.required),
      services: new FormControl('', Validators.required),
      selectedRange: new FormControl(null, Validators.required)
    })
  }

  ngOnInit(): void {
    this.serviceService.getServices()
    this.clientService.getClients()
    this.barberService.getBarbers()
  }

  findTimeSlots() {
    let services: ServiceGetI[] = this.datesForm.value.services
    const formattedDate = new Date(this.datesForm.value.appointment_date).toISOString().split('T')[0];
    const duration = services.reduce((acc, service) => acc + service.duration, 0);

    const dataSlots: BarberSlots = {
      barber_id: this.datesForm.value.barber_id,
      date: formattedDate,
      duration: JSON.stringify(duration)
    }

    this.barberService.getAvaliableSlotsBarbers(dataSlots).subscribe((res: any) => {
      this.hoursRange = res.data
    })
  }

  postDates() {
    this.barbershopService.postDates(this.datesForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.datesForm)
    })
  }

  putOutboundDispatch() {
    // console.log(this.datesForm.value);
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
      start_time:formatTime(range.start_time),
      end_time: formatTime(range.end_time),
      appointment_date: formattedDate,
      services: services.map((service: ServiceGetI) => service.id),
    })
    this.requestHelpers.saveChanges(() => this.postDates(), () => this.putOutboundDispatch(), this.datesForm.value.id, this.datesForm)
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
