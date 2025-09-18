import { Component, Inject } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { DatesGetToSetI } from '../../../barbershop/interface/barbershop.interface';
import { SalesService } from '../../services/sales.service';
import { RequestHelperService } from '../../../../../services/requestHelper.service';
import { PaymentComponent } from '../payment/payment.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductShoppingCartI } from '../../../inventory/views/products/interface/product.interface';
import { PersonGetI } from '../../../../interface/general.Interface';
import { invoicePostI, invoicePostProductI } from '../../interface/sale.interface';

@Component({
  selector: 'app-payment-product',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './payment-product.component.html',
  styleUrl: './payment-product.component.css'
})
export class PaymentProductComponent {

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
    console.log( this.data.productos);
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
    let products: { id: number, quantity: number }[] = []

    this.data.productos.map((item: ProductShoppingCartI) => {
      products.push({
        id: item.id,
        quantity: item.quantity
      })
    })

    let invoice: invoicePostProductI = {
      reference_number: this.numTicket,
      aprovation_number: this.numTransfer,
      payment_type_id: this.selectedPaymentMethod,
      client_id: this.data.usuario.id,
      // appointment_id: this.data.dates != undefined ? this.data.dates.id : 0,
      status_id: 8,
      products: products ,
    }


    this.invoiceSercice.postInvoice(invoice).subscribe((res)=>{
      this.requestHelpers.handleResponseProvitional(res, () => this.close())
    })
  }

    saveChanges() {
      console.log(this.data.usuario);

      this.requestHelpers.saveChangesNoForm(() => this.posPayment(), () => {}, this.data.usuario )
    }
}
