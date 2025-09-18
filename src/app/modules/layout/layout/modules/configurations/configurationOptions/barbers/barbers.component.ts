import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BabersService } from './services/barbers.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { GeneralRequestService } from '../../../../services/generalRequest.service';

@Component({
  selector: 'app-barbers',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './barbers.component.html',
  styleUrl: './barbers.component.css'
})
export class BarbersComponent implements OnInit{

  barberForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public barbersService: BabersService,
    private requestHelpers: RequestHelperService,
    public generalRequestService: GeneralRequestService,

  ) {
    this.barberForm = this.fb.group({
      id: 0,
      role_id: new FormControl(0, Validators.required),
      email:  new FormControl('', Validators.required),
      address:  new FormControl('',Validators.required),
      first_name:new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      // password:  new FormControl('', Validators.required),
      phone_number:  new FormControl('', Validators.required),
      commission: new FormControl('', Validators.required),
      // password_confirmation: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.barbersService.getBarbers()
    this.generalRequestService.getRol()
  }

  postBarber(){
    this.generalRequestService.postRegister(this.barberForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.barbersService.getBarbers(), this.barberForm)
    })
  }

  putBarber(){
    // this.barbersService.putBarber(this.barberForm.value).subscribe((res: any) => {
    //   this.requestHelpers.handleResponse(res, () => this.barbersService.getBarbers(), this.barberForm)
    // })
  }

  saveChanges(){
    this.barberForm.patchValue({ role_id: 2 })
    this.requestHelpers.saveChanges(() => this.postBarber(), () => this.putBarber(), this.barberForm.value.id ,this.barberForm)
  }
}
