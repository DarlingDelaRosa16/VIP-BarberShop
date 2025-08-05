import { Component, OnInit } from '@angular/core';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ProductService } from '../inventory/views/products/service/product.service';
import { ProductGetI, ProductShoppingCartI } from '../inventory/views/products/interface/product.interface';
import { PaymentComponent } from './dialog/payment/payment.component';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../configurations/configurationOptions/clients/services/clients.service';

@Component({
  selector: 'app-sale',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {

  shopingCart: ProductShoppingCartI[] = []
  filterShoppingCart: string = ''
  filterproduct: string = ''
  clientSelected: any
  totalItbis: number = 0
  total: number = 0

  constructor(
    public dialog: MatDialog,
    public productService: ProductService,
    public clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.productService.getProducts()
    this.clientService.getClients()

    // this.clientService.clients().map((client) => ({
    //   ...client,
    //   full_name: `${client.first_name} ${client.last_name}`
    // }))
  }

  showClient() {
    console.log(this.clientSelected);
    console.log(this.clientService.clients());
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

  openPaymentModal() { //elementoList: any[], nombre: string
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '1300px',
    }) //, { data: { elementoList, nombre }, }
    dialogRef.afterClosed().subscribe(() => {
    });
  }
}
