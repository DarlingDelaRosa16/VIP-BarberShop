import { Component, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductModalComponent } from './dialog/create-product-modal/create-product-modal.component';
import { ProductService } from './service/product.service';

@Component({
  selector: 'app-products',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

  constructor(
    public dialog: MatDialog,
    public productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    this.productService.getProducts()
  }

  openCreateProductModal() {
    // this.dialog.open(CreateProductModalComponent, { data: { elementList, name, property } })
    const dialogRef = this.dialog.open(CreateProductModalComponent)
    dialogRef .afterClosed().subscribe(() => {
      this.productService.getProducts()
    });
  }
}
