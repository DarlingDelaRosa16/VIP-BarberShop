import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { BarbershopService } from '../../service/barbershop.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateDateComponent } from '../../dialog/create-date/create-date.component';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { SnackBarService } from '../../../../../services/snackBar.service';
import { DetailDataComponent } from '../../../../../components/dialogs/detail-data/detail-data.component';
import { SystemInformationService } from '../../../../../services/general.service';

@Component({
  selector: 'app-list-dates',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './list-dates.component.html',
  styleUrl: './list-dates.component.css'
})
export class ListDatesComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public barbershopService: BarbershopService,
    private snackBar: SnackBarService,
    public snackbarService: SnackBarService,
    private requestHelpers: RequestHelperService,
    // private systemInformationService: SystemInformationService
  ) {
  }

  ngOnInit(): void {
    this.barbershopService.getDates()
  }

  openCreateDateModal() {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(CreateDateComponent, {
      height: '740px'
    })
    dialogRef.afterClosed().subscribe(() => {
      this.barbershopService.getDates()
    });
  }

  openDetailViewModal(elementoList: any[], nombre: string, entidad: string) {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(DetailDataComponent, { data: {elementoList, entidad,nombre}, })
    dialogRef.afterClosed().subscribe(() => {
      // this.barbershopService.getDates()
    });
  }

  changeStatusDate(idDate: number) {
    this.barbershopService.putDateStatus(idDate).subscribe((res: any) => {
      if (res.appointment) {
        this.snackbarService.snackbarSuccess()
        this.barbershopService.getDates()
      }
      // this.requestHelpers.handleResponse(res, () => this.barbershopService.getDates(), )
    })
  }

  async removeDate(idDate: number){
    console.log('yes');

    let closeAccount: boolean = await this.snackBar.snackbarConfirmation('Estas seguro de eliminar la cita?', '')

    if (closeAccount) {
      this.barbershopService.deleteDateStatus(idDate).subscribe((res: any) => {
        if (res.errorCode == 200) {
          this.snackbarService.snackbarSuccess()
          this.barbershopService.getDates()
        }
        // this.requestHelpers.handleResponse(res, () => this.barbershopService.getDates(), )
      })
    }
  }
}
