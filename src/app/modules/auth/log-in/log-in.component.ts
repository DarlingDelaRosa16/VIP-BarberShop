import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../helpers/primeNg';
import { ModulesImports } from '../../../helpers/modulesImports';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestHelperService } from '../../layout/services/requestHelper.service';
import { LogInService } from './service/logIn.service';
import { SystemInformationService } from '../../layout/services/general.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private logInService: LogInService,
    private requestHelpers: RequestHelperService,
    private systemInformationService: SystemInformationService,
  ) {
    this.loginForm = this.fb.group({
      email: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    })
  }

  ngOnInit(): void { }

  postLogIn() {
    this.logInService.postLogIn(this.loginForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => {
        // console.log(res);
        this.systemInformationService.setUserToken(res.access_token)
        localStorage.setItem("token", res.access_token)

        this.systemInformationService.setUser(res.user)
        localStorage.setItem("user", JSON.stringify(res.user))

        this.systemInformationService.setLogged(true)
        this.router.navigate(['/layout/inicio'])
      })
    })
  }


  // saveChanges() {
  //   this.requestHelpers.saveChanges(() => this.postServices(), () => this.putServices(), this.loginForm.value.id, this.loginForm)
  // }
}
