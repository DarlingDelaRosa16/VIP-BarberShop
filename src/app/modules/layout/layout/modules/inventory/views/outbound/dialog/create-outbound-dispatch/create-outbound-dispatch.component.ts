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

@Component({
  selector: 'app-create-outbound-dispatch',
  imports: [PrimeComponentsModules, ModulesImports],
  templateUrl: './create-outbound-dispatch.component.html',
  styleUrl: './create-outbound-dispatch.component.css'
})
export class CreateOutboundDispatchComponent {

  outboundDispatchForm: FormGroup;
  productsForm: FormGroup;
  products: { product_id: number, quantity: number, name: string }[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public elements: {},
    public fb: FormBuilder,
    public outboundService: OutboundService,
    public productService: ProductService,
    public barberService: BabersService,
    private requestHelpers: RequestHelperService,
    public systemInformationService: SystemInformationService,
    private dialogRef: MatDialogRef<CreateOutboundDispatchComponent>,

  ) {

    this.productsForm = this.fb.group({
      quantity: new FormControl('', Validators.required),
      product_id: new FormControl('', Validators.required),
    })

    this.outboundDispatchForm = this.fb.group({
      barber_id: new FormControl(0, Validators.required),
      dispatch_date: new FormControl('', Validators.required),
      note:new FormControl('', Validators.required),
      status_id: 9,
      products: []
    })
  }

  ngOnInit(): void {
    this.productService.getProducts()
    this.barberService.getBarbers()
  }

  addProduct() {
    this.products.push(this.productsForm.value);
    this.productsForm.reset()
  }

  removeProduct(product_id: number) {
    this.products = this.products.filter(p => p.product_id !== product_id);
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
    console.log(this.outboundDispatchForm.value);

    this.outboundDispatchForm.patchValue({
      products: this.products,
      dispatch_date: formattedDate,
      status_id: 9,
    })
    this.requestHelpers.saveChanges(() => this.postOutboundDispatch(), () => this.putOutboundDispatch(), this.outboundDispatchForm.value.id, this.outboundDispatchForm)
  }

  closeModal(): void {
    this.dialogRef.close();
  }
}
