import { Component, Inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatesGetI, DatesGetToSetI } from '../../../barbershop/interface/barbershop.interface';
import { ProductShoppingCartI } from '../../../inventory/views/products/interface/product.interface';
import { PersonGetI } from '../../../../interface/general.Interface';
import { SalesService } from '../../services/sales.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';

@Component({
  selector: 'app-payment',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {

  selectedPaymentMethod: number = 1;
  quickAmounts = [100, 120, 150, 200, 500, 1000, 2000];
  totalSum: number = 0
  montoRecibido: number = 0
  montoDevolver: number = 0
  totalItbis: number = 0
  totalSub: number = 0
  numTicket: string = ''
  numTransfer: string = ''

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { dates: DatesGetToSetI, usuario: PersonGetI, productos: ProductShoppingCartI[] },
    private invoiceSercice: SalesService,
    private requestHelpers: RequestHelperService,
    private dialogRef: MatDialogRef<PaymentComponent>,
  ) {
  }

  ngOnInit(): void {
    this.TotalSum()
  }

  fastAmount(monto: number) {
    this.montoRecibido = monto
    this.change()
  }

  change() {
    if (this.montoRecibido == null) {
      this.montoRecibido = 0
      this.montoDevolver = 0
      return
    }

    if (this.montoRecibido > this.totalSum) {
      this.montoDevolver = this.montoRecibido - this.totalSum
    } else {
      this.montoDevolver = 0
    }
  }

  TotalSum() {
    if (this.data.dates != undefined) {
      this.data.dates.services.map(service => {
        this.totalSum += service.price
      })
    } else {
      this.data.productos.map(producto => {
        this.totalItbis += producto.total_itbis_pro
        this.totalSub += producto.subTotal
      })

      this.totalSum = this.totalItbis + this.totalSub
    }
  }

  selectPaymentMethod(value: number): void {
    this.selectedPaymentMethod = value;
  }

  close() {
    this.dialogRef.close()
  }

  posPayment() {
    let invoice = {
      reference_number: this.numTicket,
      aprovation_number: this.numTransfer,
      payment_type_id: this.selectedPaymentMethod,
      client_id: this.data.dates.client_id,
      appointment_id: this.data.dates.id,
      status_id: 8,
      products: [],
    }

    this.invoiceSercice.postInvoice(invoice).subscribe((res)=>{
      this.requestHelpers.handleResponseProvitional(res, () => this.close())
    })
  }
}
