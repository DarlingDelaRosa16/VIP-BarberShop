import { Component, Inject, OnInit, signal } from '@angular/core';
import { PrimeComponentsModules } from '../../../../../../../../../helpers/primeNg';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestHelperService } from '../../../../../../../services/requestHelper.service';
import { SystemInformationService } from '../../../../../../../services/general.service';
import { OutboundService } from '../../service/outbound.service';
import { ModulesImports } from '../../../../../../../../../helpers/modulesImports';
import { ProductService } from '../../../products/service/product.service';

@Component({
  selector: 'app-create-outbound',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './create-outbound.component.html',
  styleUrl: './create-outbound.component.css'
})
export class CreateOutboundComponent implements OnInit {

  outboundForm: FormGroup;
  productsForm: FormGroup;
  products: { product_id: number, quantity: number, name: string }[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: { },
    public fb: FormBuilder,
    public outboundService: OutboundService,
    public productService: ProductService,
    private requestHelpers: RequestHelperService,
    public systemInformationService: SystemInformationService,
    private dialogRef: MatDialogRef<CreateOutboundComponent>,

  ) {

    this.productsForm = this.fb.group({
      quantity: new FormControl('', Validators.required),
      product_id: new FormControl('', Validators.required),
    })

    this.outboundForm = this.fb.group({
      id: 0,
      exit_type: "Despacho",
      exit_date: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
      products: []
    })
  }

  ngOnInit(): void { this.productService.getProducts() }

  addProduct() {
    this.products.push(this.productsForm.value);
    this.productsForm.reset()
  }

  removeProduct(product_id: number) {
    this.products = this.products.filter(p => p.product_id !== product_id);
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

    this.outboundForm.patchValue({
      products: this.products,
      exit_date: formattedDate
    })
    this.requestHelpers.saveChanges(() => this.postOutbound(), () => this.putOutbound(), this.outboundForm.value.id, this.outboundForm)
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
