import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { GeneralRequestService } from '../../../../services/generalRequest.service';
import { ClientService } from './services/clients.service';

@Component({
  selector: 'app-clients',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {

  clientForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public clientService: ClientService,
    private requestHelpers: RequestHelperService,
    public generalRequestService: GeneralRequestService,
  ) {
    this.clientForm = this.fb.group({
      id: 0,
      role_id: new FormControl(0, Validators.required),
      email:  new FormControl('', Validators.required),
      address:  new FormControl('',Validators.required),
      first_name:new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      // password:  new FormControl('', Validators.required),
      phone_number:  new FormControl('', Validators.required),
      // password_confirmation: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.clientService.getClients()
  }

  postClient(){
    this.generalRequestService.postRegister(this.clientForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.clientService.getClients(), this.clientForm)
    })
  }

  putClient(){
    // this.barbersService.putBarber(this.barberForm.value).subscribe((res: any) => {
    //   this.requestHelpers.handleResponse(res, () => this.barbersService.getBarbers(), this.barberForm)
    // })
  }

  saveChanges(){
    this.clientForm.patchValue({ role_id: 3 })
    this.requestHelpers.saveChanges(() => this.postClient(), () => this.putClient(), this.clientForm.value.id ,this.clientForm)
  }
}
