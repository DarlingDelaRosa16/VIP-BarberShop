import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../services/general.service';
import { RequestHelperService } from '../../../../services/requestHelper.service';

@Injectable({providedIn: 'root'})

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

  private sales$ = signal<any>({})
  public sales = computed(() => this.sales$())

  public getInvoices() {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/api/invoices`,this.header))
      .subscribe((res: any) => {
        this.sales$.set(res.data);
        console.log(res);
      });
  }
}
