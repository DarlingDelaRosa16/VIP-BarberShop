import { Component, Inject } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../../../helpers/modulesImports';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OutboundService } from '../../service/outbound.service';
import { ProductService } from '../../../products/service/product.service';
import { BabersService } from '../../../../../configurations/configurationOptions/barbers/services/barbers.service';
import { RequestHelperService } from '../../../../../../../services/requestHelper.service';
import { SystemInformationService } from '../../../../../../../services/general.service';
import { ProductShoppingCartI } from '../../../products/interface/product.interface';
import { MessageService } from 'primeng/api';
import { OutboundGetDispacthI, OutboundGetI } from '../../interface/outbound.interface';

@Component({
  selector: 'app-create-outbound-dispatch',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './create-outbound-dispatch.component.html',
  styleUrl: './create-outbound-dispatch.component.css',
  providers: [MessageService]
})
export class CreateOutboundDispatchComponent {

  outboundDispatchForm: FormGroup;
  shopingCart: ProductShoppingCartI[] = []
  total: number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: OutboundGetDispacthI,
    public fb: FormBuilder,
    public outboundService: OutboundService,
    private messageService: MessageService,
    public productService: ProductService,
    public barberService: BabersService,
    private requestHelpers: RequestHelperService,
    public systemInformationService: SystemInformationService,
    private dialogRef: MatDialogRef<CreateOutboundDispatchComponent>,

  ) {

    this.outboundDispatchForm = this.fb.group({
      id: 0,
      dispatch_date: new FormControl('', Validators.required),
      barber_id: new FormControl(0, Validators.required),
      note: new FormControl('',),
      products: [],
      status_id: 0,

      quantity: new FormControl(''),
      product_id: new FormControl(''),
    })
  }

  ngOnInit(): void {
    console.log(this.elements);


    this.productService.getProducts()
    this.barberService.getBarbers()

    if (this.elements != null) { this.setDataOutbound() }
  }

  setDataOutbound() {
    const barber = this.barberService.barbers().find(b => `${b.first_name} ${b.last_name}` === this.elements.barber_name) || null;

    this.outboundDispatchForm.patchValue({
      id: this.elements.id,
      barber_id: barber,
      dispatch_date: new Date(this.elements.dispatch_date),
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
    const product = this.outboundDispatchForm.value.product_id;
    const quantity = this.outboundDispatchForm.value.quantity;

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

    this.outboundDispatchForm.get('product_id')?.reset();
    this.outboundDispatchForm.get('quantity')?.reset();
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
    this.outboundDispatchForm.reset()
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

  postOutboundDispatch() {
    this.outboundService.postOutboundDispatch(this.outboundDispatchForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.outboundDispatchForm)
    })
  }

  putOutboundDispatch() {
    this.outboundService.putOutboundDispatch(this.outboundDispatchForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.outboundDispatchForm)
    })
  }

  saveChanges() {
    const fechaSeleccionada = this.outboundDispatchForm.value.dispatch_date; // Suponiendo que es un Date
    const formattedDate = new Date(fechaSeleccionada).toISOString().split('T')[0];

    let products: { product_id: number, quantity: number }[] = []

    this.shopingCart.map((item: ProductShoppingCartI) => {
      products.push({
        product_id: item.id,
        quantity: item.quantity
      })
    })

    let form = this.outboundDispatchForm.value

    this.outboundDispatchForm.patchValue({
      barber_id: form.barber_id.id,
      products: products,
      dispatch_date: formattedDate,
      status_id: 9,
    })

    this.requestHelpers.saveChanges(() => this.postOutboundDispatch(), () => this.putOutboundDispatch(), this.outboundDispatchForm.value.id, this.outboundDispatchForm)
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
