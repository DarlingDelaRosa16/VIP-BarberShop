import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ProductService } from '../inventory/views/products/service/product.service';
import { ProductGetI, ProductShoppingCartI } from '../inventory/views/products/interface/product.interface';
import { PaymentComponent } from './dialog/payment/payment.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../configurations/configurationOptions/clients/services/clients.service';
import { PersonGetI } from '../../interface/general.Interface';
import { Router } from '@angular/router';
import { ServiceGetI } from '../configurations/configurationOptions/services/interface/services.interface';
import { MessageService } from 'primeng/api';
import { DatesGetToSetI } from '../barbershop/interface/barbershop.interface';
import { PaymentProductComponent } from './dialog/payment-product/payment-product.component';

@Component({
  selector: 'app-sale',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
  providers: [MessageService]
})
export class SaleComponent implements OnInit {

  shopingCart: ProductShoppingCartI[] = []
  filterShoppingCart: string = ''
  filterproduct: string = ''
  clientSelected!: PersonGetI
  totalItbis: number = 0
  total: number = 0
  clientIdFromNav!: number
  appo!: DatesGetToSetI

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public productService: ProductService,
    public clientService: ClientService,
    private messageService: MessageService,

  ) {

    const nav = this.router.getCurrentNavigation();
    if (nav?.extras.state) {

      const data = nav.extras.state['data'];

      nav.extras.state['data'].services.map((service: ServiceGetI, index: number) => {
        this.shopingCart.push({
          itbis: 0,
          total_itbis_pro: 0,
          name: service.name,
          id: service.id,
          sale_price: service.price,
          unit_cost: service.price,
          quantity: 1,
          subTotal: service.price,
        })
      })

      this.clientIdFromNav = data.client_id;
      this.appo = data
    }
  }

  private injector = inject(EnvironmentInjector);

  ngOnInit(): void {
    this.clientService.getClients()
    this.productService.getProducts()

    this.injector.runInContext(() => {
      effect(() => {
        this.clientSelected = this.clientService.clients().find(
          c => c.id === this.clientIdFromNav
        )!;
      });
    });
  }

  filterProduct() {
    this.productService.getProducts(this.filterproduct)
  }

  addItemShoppingCart(item: ProductShoppingCartI) {
    const existingItem = this.shopingCart.find(p => p.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subTotal = existingItem.quantity * item.sale_price;
      existingItem.total_itbis_pro = existingItem.subTotal * (item.itbis / 100);
    } else {
      this.shopingCart.push({
        ...item,
        quantity: 1,
        subTotal: 1 * item.sale_price,
        total_itbis_pro: item.sale_price * (item.itbis / 100)
      });
    }

    this.totalSum()
  }

  removeItemShoppingCart(itemId: number) {
    const index = this.shopingCart.findIndex(item => item.id === itemId);

    if (index > -1) {
      const item = this.shopingCart[index];

      if (item.quantity > 1) {
        item.quantity -= 1;
        item.subTotal = item.quantity * item.sale_price;
        item.total_itbis_pro = item.subTotal * (item.itbis / 100);
      } else {
        this.shopingCart.splice(index, 1);
      }
    }

    this.totalSum()
  }

  get filteredCart() {
    return this.shopingCart.filter(product =>
      product.name.toLowerCase().includes(this.filterShoppingCart.toLowerCase())
    );
  }

  totalSum() {
    this.total = this.totalItbis = 0

    this.shopingCart.map((item) => {
      this.total += item.subTotal
      this.totalItbis += item.total_itbis_pro
    })
  }

  openPaymentModal() {
    if (this.shopingCart.length > 0 && this.clientSelected != undefined) {
      const dialogRef = this.dialog.open(PaymentProductComponent, { data: { usuario: this.clientSelected, productos: this.shopingCart } })
      dialogRef.afterClosed().subscribe(() => {
        this.shopingCart = []
        this.clientSelected = undefined as any;
        this.productService.getProducts()
      });
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: `El carrito debe tener al menos un producto y debe haber un usuario seleccionado.`,
        life: 2700
      });
    }
  }
}
