import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { RecomendationService } from './services/recomendation.service';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../../../helpers/material';

@Component({
  selector: 'app-recomendations',
  imports: [ModulesImports, PrimeComponentsModules, MaterialComponents],
  templateUrl: './recomendations.component.html',
  styleUrl: './recomendations.component.css'
})
export class RecomendationsComponent implements OnInit{
   recomendationForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    public recomendationService: RecomendationService,
    private requestHelpers: RequestHelperService,

  ) {
    this.recomendationForm = this.fb.group({
      id: 0,
      previous_price: null,
      name: new FormControl('', Validators.required),
      current_price: new FormControl(0, Validators.required),
      duration: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    })
  }

  ngOnInit(): void { this.recomendationService.getRecomendation() }

  postServices() {
    this.recomendationService.postRecomendation(this.recomendationForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.recomendationService.getRecomendation(), this.recomendationForm)
    })
  }

  // putServices() {
  //   this.recomendationService.putRecomendation(this.recomendationForm.value).subscribe((res: any) => {
  //     this.requestHelpers.handleResponse(res, () => this.recomendationService.getRecomendation(), this.recomendationForm)
  //   })
  // }


  saveChanges() {
    this.requestHelpers.saveChanges(() => this.postServices(), () => {}, this.recomendationForm.value.id, this.recomendationForm)
  }
}
