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
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
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
