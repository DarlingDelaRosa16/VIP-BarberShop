import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from './services/services.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';

@Component({
  selector: 'app-services',
  imports: [PrimeComponentsModules, ModulesImports,],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {

  servicesForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public servicesService: ServicesService,
    private requestHelpers: RequestHelperService,

  ) {
    this.servicesForm = this.fb.group({
      id: 0,
      previous_price: null,
      name: new FormControl('', Validators.required),
      current_price: new FormControl(0, Validators.required),
      duration: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    })
  }

  ngOnInit(): void { this.servicesService.getServices() }

  postServices() {
    this.servicesService.postServices(this.servicesForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.servicesService.getServices(), this.servicesForm)
    })
  }

  putServices() {
    this.servicesService.putService(this.servicesForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.servicesService.getServices(), this.servicesForm)
    })
  }

  saveChanges() {
    this.requestHelpers.saveChanges(() => this.postServices(), () => this.putServices(), this.servicesForm.value.id, this.servicesForm)
  }
}
