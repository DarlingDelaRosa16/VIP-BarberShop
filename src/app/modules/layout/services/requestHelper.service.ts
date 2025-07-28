
import { EventEmitter, Injectable, inject } from '@angular/core';
import { SnackBarService } from './snackBar.service';
import { catchError, Observable, throwError } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Injectable({ providedIn: 'root' })

export class RequestHelperService {

  constructor(
    public snackBar: SnackBarService,
  ) { }

  handleRequest<T>(request: () => Observable<T>): Observable<T> {
    return request().pipe(
      catchError((error) => {
        this.snackBar.snackbarLouder(false);
        setTimeout(() => {
          error.error.message ? this.snackBar.snackbarError(error.error.message, 6000)
            : this.snackBar.snackbarServerError();
        }, 500);
        return throwError(error)
      }),
    );
  }

  handleResponse(response: any, onSuccess: () => void, formToReset?: FormGroup, onSecondSuccess?: () => void) {
    if (response.errorCode) {
      this.snackBar.snackbarLouder(false);
      setTimeout(() => {
        this.snackBar.snackbarSuccess();
        onSuccess();
        formToReset?.reset();
        if (onSecondSuccess != undefined) onSecondSuccess();
      }, 500);
    } else {
      this.snackBar.snackbarLouder(false);
      this.snackBar.snackbarError('Ocurrio un error la operación no se realizo correctamente.')
    }
  }

  saveChanges(saveFunction: () => void, updateFunction: () => void, idRegister: number, form: FormGroup) {
    if (form.valid) {
      this.snackBar.snackbarLouder(true)
      if (idRegister > 0) updateFunction()
      else saveFunction()
    } else this.snackBar.snackbarError('Completa los campos requeridos para realizar la acción.')
  }
}
