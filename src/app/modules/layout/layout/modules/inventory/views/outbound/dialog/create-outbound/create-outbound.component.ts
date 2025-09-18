import { Component, Inject, OnInit, signal } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../../../helpers/primeNg';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestHelperService } from '../../../../../../../services/requestHelper.service';
import { SystemInformationService } from '../../../../../../../services/general.service';
import { OutboundService } from '../../service/outbound.service';
import { ModulesImports } from '../../../../../../../../../helpers/modulesImports';
import { ProductService } from '../../../products/service/product.service';
import { OutboundGetI } from '../../interface/outbound.interface';
import { BabersService } from '../../../../../configurations/configurationOptions/barbers/services/barbers.service';
import { ProductShoppingCartI } from '../../../products/interface/product.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-outbound',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './create-outbound.component.html',
  styleUrl: './create-outbound.component.css',
  providers: [MessageService]
})
export class CreateOutboundComponent implements OnInit {

  outboundForm: FormGroup;
  shopingCart: ProductShoppingCartI[] = []
  total: number = 0

  tiposSalidaAlmacen = [
    { id: 2, nombre: "Transferencia" },
    { id: 3, nombre: "Devolución a Proveedor" },
    { id: 4, nombre: "Ajuste de Inventario" },
    { id: 5, nombre: "Consumo Interno" },
    { id: 6, nombre: "Donación" },
    { id: 7, nombre: "Préstamo Entregado" },
    { id: 8, nombre: "Exportación" },
    { id: 9, nombre: "Muestra Comercial" },
    { id: 10, nombre: "Merma / Desperdicio" },
  ];

  constructor(
    public fb: FormBuilder,
    public productService: ProductService,
    private messageService: MessageService,
    public outboundService: OutboundService,
    private requestHelpers: RequestHelperService,
    @Inject(MAT_DIALOG_DATA) public elements: OutboundGetI,
    private dialogRef: MatDialogRef<CreateOutboundComponent>,
    public systemInformationService: SystemInformationService,
  ) {

    this.outboundForm = this.fb.group({
      id: 0,
      exit_type: new FormControl('', Validators.required),
      quantity: new FormControl(''),
      product_id: new FormControl(''),
      exit_date: new FormControl('', Validators.required),
      note: new FormControl('',),
      products: []
    })
  }

  ngOnInit(): void {
    this.productService.getProducts()

    if (this.elements != null) { this.setDataOutbound() }
  }

  setDataOutbound() {
    this.outboundForm.patchValue({
      id: this.elements.id,
      exit_type: this.elements.exit_type,
      exit_date: new Date(this.elements.exit_date),
      note: this.elements.note
    })

    this.elements.products.map((exit) => {
      this.shopingCart.push({
        itbis: 0,
        total_itbis_pro: 0,
        name: exit.product_name,
        id: exit.product_id,
        unit_cost: exit.unit_cost,
        sale_price: exit.unit_cost,
        quantity: exit.quantity,
        subTotal: Number(exit.unit_cost) * exit.quantity,
      })
    })

    this.totalSum()
  }

  addItem() {
    const product = this.outboundForm.value.product_id;
    const quantity = this.outboundForm.value.quantity;

    if (!product || quantity <= 0) return;

    const existingItem = this.shopingCart.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;

    if (currentQuantity + quantity > product.stock) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: `La cantidad total (${currentQuantity + quantity}) no puede ser mayor a la existencia (${product.stock}).`,
        life: 2900
      });
      return;
    }

    this.addItemShoppingCart(product, quantity);

    this.outboundForm.get('product_id')?.reset();
    this.outboundForm.get('quantity')?.reset();
  }

  addItemShoppingCart(item: ProductShoppingCartI, quantity: number) {
    const index = this.shopingCart.findIndex(cartItem => cartItem.id === item.id);

    if (index >= 0) {
      // Si ya existe, acumular la cantidad y recalcular totales
      this.shopingCart[index].quantity += quantity;
      this.shopingCart[index].subTotal = this.shopingCart[index].unit_cost * this.shopingCart[index].quantity;
      this.shopingCart[index].total_itbis_pro = this.shopingCart[index].unit_cost * (this.shopingCart[index].itbis / 100) * this.shopingCart[index].quantity;
    } else {
      // Si no existe, agregar nuevo
      this.shopingCart.push({
        ...item,
        quantity: quantity,
        subTotal: item.unit_cost * quantity,
        total_itbis_pro: item.unit_cost * (item.itbis / 100) * quantity
      });
    }

    this.totalSum();
  }

  clearForm() {
    this.outboundForm.reset()
    this.shopingCart = []
    this.total = 0
  }

  totalSum() {
    this.total = 0

    this.shopingCart.map((item) => {
      this.total += item.subTotal
    })
  }

  removeItemShoppingCart(itemId: number) {
    const index = this.shopingCart.findIndex(item => item.id === itemId);
    this.shopingCart.splice(index, 1);

    this.totalSum()
  }

  postOutbound() {
    this.outboundService.postOutbound(this.outboundForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.outboundForm)
    })
  }

  putOutbound() {
    this.outboundService.putOutbound(this.outboundForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.outboundForm)
    })
  }

  saveChanges() {
    const fechaSeleccionada = this.outboundForm.value.exit_date; // Suponiendo que es un Date
    const formattedDate = new Date(fechaSeleccionada).toISOString().split('T')[0];

    let products: { product_id: number, quantity: number }[] = []

    this.shopingCart.map((item: ProductShoppingCartI) => {
      products.push({
        product_id: item.id,
        quantity: item.quantity
      })
    })

    this.outboundForm.patchValue({
      products: products,
      exit_date: formattedDate
    })

    this.requestHelpers.saveChanges(() => this.postOutbound(), () => this.putOutbound(), this.outboundForm.value.id, this.outboundForm)
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
