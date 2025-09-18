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

  private outbound$ = signal<OutboundGetI[]>([]);
private outboundDis$ = signal<OutboundGetI[]>([]);

// Loading states
private loadingOutbound$ = signal<boolean>(false);
private loadingOutboundDis$ = signal<boolean>(false);

// Computed públicos
public outbound = computed(() => this.outbound$());
public outboundDis = computed(() => this.outboundDis$());
public loadingOutbound = computed(() => this.loadingOutbound$());
public loadingOutboundDis = computed(() => this.loadingOutboundDis$());

// Obtener Outbound
public getOutbound() {
  this.loadingOutbound$.set(true);

  this.requestHelper.handleRequest(() =>
    this.http.get(`${this.baseURL}/inventory-exits`, this.header)
  ).subscribe({
    next: (res: any) => {
      this.outbound$.set(res.data);
      this.loadingOutbound$.set(false);
    },
    error: () => {
      this.loadingOutbound$.set(false);
    }
  });
}

// Obtener Outbound Dispatch
public getOutboundDispatch() {
  this.loadingOutboundDis$.set(true);

  this.requestHelper.handleRequest(() =>
    this.http.get(`${this.baseURL}/barber-dispatch`, this.header)
  ).subscribe({
    next: (res: any) => {
      this.outboundDis$.set(res.data);
      this.loadingOutboundDis$.set(false);
    },
    error: () => {
      this.loadingOutboundDis$.set(false);
    }
  });
}

  public postOutbound(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/inventory-exits`, outbound, this.header, ));
  }

  public postOutboundDispatch(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/barber-dispatch`, outbound, this.header, ));
  }

  public putOutbound(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/inventory-exits/${outbound.id}`, outbound, this.header, ));
  }

  public putOutboundDispatch(outbound: OutboundPostI) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/barber-dispatch/${outbound.id}`, outbound, this.header, ));
  }

  public deleteOutbound(inbound: number) {
    return this.requestHelper.handleRequest(() => this.http.delete(`${this.baseURL}/inventory-exits/${inbound}`, this.header,));
  }
}
