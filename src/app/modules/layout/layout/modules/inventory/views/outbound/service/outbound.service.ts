import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';
import { OutboundGetI, OutboundPostI } from '../interface/outbound.interface';

@Injectable({providedIn: 'root'})

export class OutboundService {

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

  private outbound$ = signal<OutboundGetI[]>([])
  public outbound = computed(() => this.outbound$())

  private outboundDis$ = signal<OutboundGetI[]>([])
  public outboundDis = computed(() => this.outboundDis$())

  public getOutbound() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/inventory-exits`, this.header))
      .subscribe((res: any) => { this.outbound$.set(res.data); });
  }

  public getOutboundDispatch() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/barber-dispatch`, this.header))
      .subscribe((res: any) => { this.outboundDis$.set(res.data); console.log(res);
      });
  }

  public postOutbound(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/inventory-exits`, outbound, this.header, ));
  }

  public postOutboundDispatch(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/barber-dispatch`, outbound, this.header, ));
  }

  public putOutbound(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/products/${outbound.id}`, outbound, this.header, ));
  }

  public putOutboundDispatch(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/barber-dispatch/${outbound.id}`, outbound, this.header, ));
  }
}
