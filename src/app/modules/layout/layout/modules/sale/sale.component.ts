import { Component, OnInit } from '@angular/core';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ProductService } from '../inventory/views/products/service/product.service';
import { ProductGetI, ProductShoppingCartI } from '../inventory/views/products/interface/product.interface';
import { PaymentComponent } from './dialog/payment/payment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sale',
  imports: [MaterialComponents, ModulesImports, PrimeComponentsModules],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {

  shopingCart: ProductShoppingCartI[] = []
  filterShoppingCart: string = ''

  constructor(
    public dialog: MatDialog,
    public productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.productService.getProducts()
  }

  addItemShoppingCart(item: ProductShoppingCartI) {
    const existingItem = this.shopingCart.find(p => p.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.subTotal = existingItem.quantity * Number(item.sale_price);
      existingItem.itbis = existingItem.subTotal * (existingItem.itbis / 100);

    } else {
      this.shopingCart.push({
        ...item,
        quantity: 1,
        subTotal: 1 * Number(item.sale_price),
        itbis: item.subTotal * (Number(item.itbis) / 100)
      });
    }
  }

  removeItemShoppingCart(itemId: number) {
    const index = this.shopingCart.findIndex(item => item.id === itemId);

    if (index > -1) {
      if (this.shopingCart[index].quantity > 1) {
        this.shopingCart[index].quantity -= 1;
      } else {
        this.shopingCart.splice(index, 1);
      }
    }
  }

  get filteredCart() {
    return this.shopingCart.filter(product =>
      product.name.toLowerCase().includes(this.filterShoppingCart.toLowerCase())
    );
  }

  totalSum() {

  }

  openPaymentModal() { //elementoList: any[], nombre: string
    const dialogRef = this.dialog.open(PaymentComponent, {
      width: '1300px',
      // height: '600px',

    }) //, { data: { elementoList, nombre }, }
    dialogRef.afterClosed().subscribe(() => {
    });
  }
}
