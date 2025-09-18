import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../helpers/modulesImports';
import { MatDialog } from '@angular/material/dialog';
import { CreateProductModalComponent } from './dialog/create-product-modal/create-product-modal.component';
import { ProductService } from './service/product.service';
import { MaterialComponents } from '../../../../../../../helpers/material';
import { NoDataComponent } from '../../../../../components/no-data/no-data.component';
import { ProductGetI } from './interface/product.interface';
import { MessageService } from 'primeng/api';
import { SnackBarService } from '../../../../../services/snackBar.service';

@Component({
  selector: 'app-products',
  imports: [PrimeComponentsModules, ModulesImports, MaterialComponents, NoDataComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  providers: [MessageService]

})
export class ProductsComponent implements OnInit {

  searchProduct: string = '';
  rangeDates: Date[] | null = null;
  products: any[] = [];
  private injector = inject(EnvironmentInjector);

  constructor(
    public dialog: MatDialog,
    private snackBar: SnackBarService,
    public productService: ProductService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit(): void {
    this.productService.getProducts()

    this.injector.runInContext(() => {
      effect(() => {
        this.products = this.productService.products()
      });
    });

  }

  filterProduct(): void {
    const selectedName: string | null = this.searchProduct
      ? String(this.searchProduct).trim()
      : null;

    let filteredProducts = [...this.productService.products()]; // 👈 asumo que tu service expone products()

    // 🔹 Filtro por nombre de producto
    if (selectedName) {
      filteredProducts = filteredProducts.filter((prod: any) =>
        (prod.name || '').toLowerCase().includes(selectedName.toLowerCase())
      );
    }

    // 🔹 Filtro por rango de fechas
    if (this.rangeDates && this.rangeDates.length === 2 && this.rangeDates[1] != null) {
      const [startDate, endDate] = this.rangeDates;
      if (startDate && endDate) {
        const start = new Date(startDate).setHours(0, 0, 0, 0);
        const end = new Date(endDate).setHours(23, 59, 59, 999);

        filteredProducts = filteredProducts.filter((prod: any) => {
          const createdDate = new Date(prod.created_at).getTime(); // 👈 usa la propiedad de fecha de tu modelo
          return createdDate >= start && createdDate <= end;
        });
      }
    }

    this.products = filteredProducts;

    // 🔹 Mensajes si no hay resultados
    if (filteredProducts.length === 0) {
      if (selectedName && this.rangeDates?.length === 2 && this.rangeDates[1] != null) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay productos con el nombre "${selectedName}" en el rango de fechas seleccionado`,
          life: 4000
        });
      } else if (selectedName) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay productos con el nombre "${selectedName}"`,
          life: 2700
        });
      } else if (this.rangeDates?.length === 2 && this.rangeDates[1] != null) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay productos dentro del rango de fechas seleccionado`,
          life: 2900
        });
      }
    }
  }

  clearFilters(): void {
    this.searchProduct = '';
    this.rangeDates = null;
    this.products = this.productService.products(); // 👈 reset al estado inicial
  }

  openCreateProductModal(product: ProductGetI | null = null) {
    const dialogRef = this.dialog.open(CreateProductModalComponent, { data: product })
    dialogRef.afterClosed().subscribe(() => {
      this.productService.getProducts()
    });
  }

  async removeProduct(idInbound: number) {
    let closeAccount: boolean = await this.snackBar.snackbarConfirmation('Estas seguro de eliminar la cita?', '')

    if (closeAccount) {
      this.productService.deleteInbound(idInbound).subscribe((res: any) => {
        if (res.errorCode == 200) {
          this.snackBar.snackbarSuccess()
          this.productService.getProducts()
        }
      })
    }
  }

}
