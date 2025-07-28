import { Component } from '@angular/core';
import { MaterialComponents } from '../../../helpers/material';
import { ModulesImports } from '../../../helpers/modulesImports';
import { SnackBarService } from '../services/snackBar.service';
import { SystemInformationService } from '../services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [MaterialComponents, ModulesImports],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(
    private router: Router,
    private snackBar: SnackBarService,
    private systemInformationService: SystemInformationService
  ){
    this.user = this.systemInformationService.getUser
    console.log(this.user);

  }
  user: any
  sidenavOpened: boolean = false;

  async logOut(){
    let closeAccount: boolean = await this.snackBar.snackbarConfirmation('Estas seguro de cerrar sesión?', '')
    if (closeAccount) {
      this.systemInformationService.setLogged(false)
      localStorage.clear()
      this.router.navigate(['/login'])
    }
  }
}
