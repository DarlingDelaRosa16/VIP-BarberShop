import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { LogInService } from "../modules/auth/log-in/service/logIn.service";
import { SystemInformationService } from "../modules/layout/services/general.service";

export const authGuardBackToLogIn: CanActivateFn = (route, state) => {

  const auth = inject(SystemInformationService)
  auth.checkIsLoggedIn()

  if(auth.getLogged){
    // router.navigate(['/almacen/inicio'])
    return false
  }else{
    return true
  }
};

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(SystemInformationService)
  const router = inject(Router)

  auth.checkIsLoggedIn()

  if(auth.getLogged){
    return true
  }else{
    router.navigate(['/login'])
    return false
  }
};
