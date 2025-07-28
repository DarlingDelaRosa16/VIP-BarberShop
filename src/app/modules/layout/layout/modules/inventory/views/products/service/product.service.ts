import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';
import { ProductGetI, ProductPostI } from '../interface/product.interface';

@Injectable({providedIn: 'root'})

export class ProductService {

  private token: string;
  private baseURL: string;
  private headers: HttpHeaders;
  private header: { headers: HttpHeaders };

  constructor(
    private http: HttpClient,
    private systemInformation: SystemInformationService,
    private requestHelper: RequestHelperService
  ) {
    this.token = this.systemInformation.getToken;
    this.baseURL = this.systemInformation.getURL;
    this.headers = new HttpHeaders({ 'Authorization': this.token });
    this.header = { headers: this.headers };
  }

  private products$ = signal<ProductGetI[]>([])
  public products = computed(() => this.products$())

  public getProducts() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/products`, this.header))
      .subscribe((res: any) => { this.products$.set(res.data); });
  }

  public postProducts(product: ProductPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/products`, product, this.header, ));
  }

  public putProducts(product: ProductPostI) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/products/${product.id}`, product, this.header, ));
  }
}
