import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestHelperService } from '../../../../../../../services/requestHelper.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { PrimeComponentsModules } from '../../../../../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../../../../../helpers/modulesImports';
import { SystemInformationService } from '../../../../../../../services/general.service';

@Component({
  selector: 'app-create-product-modal',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.css'
})
export class CreateProductModalComponent {

  productForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: { elementList: any[], name: string, property: string },
    public fb: FormBuilder,
    public productService: ProductService,
    private requestHelpers: RequestHelperService,
    public systemInformationService: SystemInformationService,
    private dialogRef: MatDialogRef<CreateProductModalComponent>,

  ) {
    this.productForm = this.fb.group({
      id: 0,
      status_id: 1,
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      sale_price: new FormControl(0, Validators.required),
      unit_cost: new FormControl(0, Validators.required),
      itbis: new FormControl(0, Validators.required),
      stock: 0,
    })
  }

  ngOnInit(): void { }


  closeModal(): void {
    this.dialogRef.close();
  }

  postProducts() {
    this.productService.postProducts(this.productForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.productForm)
    })
  }

  putProducts() {
    this.productService.putProducts(this.productForm.value).subscribe((res: any) => {
      this.requestHelpers.handleResponse(res, () => this.closeModal(), this.productForm)
    })
  }

  saveChanges() {
    this.requestHelpers.saveChanges(() => this.postProducts(), () => this.putProducts(), this.productForm.value.id, this.productForm)
  }
}
