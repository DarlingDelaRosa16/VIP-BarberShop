import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MiniCardComponent } from './components/mini-card/mini-card.component';
import { GeneralRequestService } from '../../services/generalRequest.service';

@Component({
  selector: 'app-home',
  imports: [PrimeComponentsModules, ModulesImports, MiniCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(
    public generalService: GeneralRequestService,
  ) { }

  ngOnInit(): void {
    this.generalService.getDaily()
    console.log(this.generalService.daily());

  }
}
