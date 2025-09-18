import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SystemInformationService } from '../../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../../services/requestHelper.service';
import { InboundService } from '../../services/inbound.service';
import { SnackBarService } from '../../../../../../../services/snackBar.service';
import { ProductService } from '../../../products/service/product.service';
import { PrimeComponentsModules } from '../../../../../../../../../helpers/primeNg';
import { MaterialComponents } from '../../../../../../../../../helpers/material';
import { ModulesImports } from '../../../../../../../../../helpers/modulesImports';
import { ProductShoppingCartI } from '../../../products/interface/product.interface';
import { inboundI } from '../../interface/inbound.interface';

@Component({
  selector: 'app-create-inbound',
  imports: [PrimeComponentsModules, MaterialComponents, ModulesImports],
  templateUrl: './create-inbound.component.html',
  styleUrl: './create-inbound.component.css'
})
export class CreateInboundComponent implements OnInit {

  inboundForm: FormGroup;
  loading: boolean = false
  shopingCart: ProductShoppingCartI[] = []
  totalItbis: number = 0
  totaltoPay: number = 0
  total: number = 0

  tiposEntradaAlmacen = [
    { id: 1, nombre: "Compra" },
    { id: 2, nombre: "Transferencia" },
    { id: 3, nombre: "Devolución de Cliente" },
    { id: 4, nombre: "Ajuste de Inventario" },
    { id: 5, nombre: "Producción Terminada" },
    { id: 6, nombre: "Donación" },
    { id: 7, nombre: "Préstamo Devuelto" },
    { id: 8, nombre: "Importación" },
    { id: 9, nombre: "Recolección Interna" },
    { id: 10, nombre: "Inventario Inicial" },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: inboundI,
    public fb: FormBuilder,
    public snackBar: SnackBarService,
    public productService: ProductService,
    public inboundService: InboundService,
    private requestHelpers: RequestHelperService,
    public systemInformationService: SystemInformationService,
    private dialogRef: MatDialogRef<CreateInboundComponent>,

  ) {
    this.inboundForm = this.fb.group({
      id: new FormControl(0),
      entry_type: new FormControl(0, Validators.required),
      entry_date: new FormControl(0, Validators.required),
      invoice_number: new FormControl(''),
      product_id: new FormControl(''),
      quantity: new FormControl(0),
      note: new FormControl(''),
      products: new FormControl([], Validators.required),
    })
  }

  ngOnInit(): void {
    this.productService.getProducts()

    if (this.elements != null) { this.setDataInbound() }
  }

  setDataInbound() {
    this.inboundForm.patchValue({
      id: this.elements.id,
      entry_type: this.elements.entry_type,
      entry_date: new Date(this.elements.entry_date),
      invoice_number: this.elements.invoice_number,
      note: this.elements.note
    })

    this.elements.entry_details.map((entry) => {
      this.shopingCart.push({
        itbis: 0,
        total_itbis_pro:entry.quantity * Number(entry.product.unit_cost) * (entry.product.itbis / 100) ,
        name: entry.product.name,
        id: entry.product.id,
        sale_price: entry.product.unit_cost,
        unit_cost: entry.product.unit_cost,
        quantity: entry.quantity,
        subTotal: Number(entry.product.unit_cost) * entry.quantity,
      })
    })

    this.totalSum()
  }

  clearForm() {
    this.inboundForm.reset()
    this.shopingCart = []
  }

  addItem() {
    if (this.inboundForm.value.product_id.id != undefined && this.inboundForm.value.quantity > 0) {
      this.addItemShoppingCart(this.inboundForm.value.product_id, this.inboundForm.value.quantity)
      this.inboundForm.get('product_id')?.reset()
      this.inboundForm.get('quantity')?.reset()
    }
  }

  addItemShoppingCart(item: ProductShoppingCartI, quantity: number) {

    this.shopingCart.push({
      ...item,
      quantity: quantity,
      subTotal: item.sale_price * quantity,
      total_itbis_pro: item.sale_price * (item.itbis / 100) * quantity
    });

    this.totalSum()
  }

  removeItemShoppingCart(itemId: number) {
    const index = this.shopingCart.findIndex(item => item.id === itemId);
    this.shopingCart.splice(index, 1);

    this.totalSum()
  }

  totalSum() {
    this.total = this.totalItbis = 0

    this.shopingCart.map((item) => {
      this.total += item.subTotal
      this.totalItbis += item.total_itbis_pro
    })
    this.totaltoPay = this.total + this.totalItbis
  }

  postInbound() {
    this.inboundService.postInbound(this.inboundForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.inboundForm)
      this.clearForm()
      this.closeModal()
    })
  }

  putInbound() {
    this.inboundService.putInbound(this.inboundForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.inboundForm, ()=> this.clearForm())
      this.clearForm()
      this.closeModal()
    })
  }

  saveChanges() {
    const dateValue = this.inboundForm.value.entry_date;
    let formattedDate

    if (dateValue) {
      formattedDate = new Date(dateValue).toISOString().split('T')[0];
    }

    let product = this.shopingCart.map((item: any) => {
      return { product_id: item.id, quantity: item.quantity }
    })

    this.inboundForm.patchValue({
      products: product,
      entry_date: formattedDate
    })

    this.requestHelpers.saveChanges(() => this.postInbound(), () => this.putInbound(), this.inboundForm.value.id, this.inboundForm)
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
