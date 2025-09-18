import { Component } from '@angular/core';
import { MaterialComponents } from '../../../helpers/material';
import { ModulesImports } from '../../../helpers/modulesImports';
import { SnackBarService } from '../services/snackBar.service';
import { SystemInformationService } from '../services/general.service';
import { Router } from '@angular/router';
import { PrimeComponentsModules } from '../../../helpers/primeNg';

@Component({
  selector: 'app-layout',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  user: any
  sidenavOpened: boolean = false;
  ventaOpened: boolean = false;
  reportsOpened: boolean = false;
  inventaryOpened: boolean = false;

  constructor(
    private router: Router,
    private snackBar: SnackBarService,
    private systemInformationService: SystemInformationService
  ){
    this.user = this.systemInformationService.getUser
  }

  async logOut(){
    let closeAccount: boolean = await this.snackBar.snackbarConfirmation('Estas seguro de cerrar sesión?', '')
    if (closeAccount) {
      this.systemInformationService.setLogged(false)
      localStorage.clear()
      this.router.navigate(['/login'])
    }
  }
}
