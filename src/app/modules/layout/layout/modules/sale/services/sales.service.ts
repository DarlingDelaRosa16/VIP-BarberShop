import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../services/general.service';
import { RequestHelperService } from '../../../../services/requestHelper.service';
import { invoiceGetI, invoicePostI } from '../interface/sale.interface';

@Injectable({ providedIn: 'root' })

export class SalesService {

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

  private sales$ = signal<invoiceGetI[]>([]);
  private loadingSales$ = signal<boolean>(false);

  public sales = computed(() => this.sales$());
  public loadingSales = computed(() => this.loadingSales$());

  public getInvoices() {
    this.loadingSales$.set(true); // empieza cargando

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/invoices`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.sales$.set(res.data);
        this.loadingSales$.set(false); // terminó de cargar
        console.log(res);
      },
      error: () => {
        this.loadingSales$.set(false); // aunque falle, quitamos el loading
      }
    });
  }
  public postInvoice(invoice: invoicePostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/invoices`, invoice, this.header,));
  }
}
