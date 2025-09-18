import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';
import { inboundI } from '../interface/inbound.interface';

@Injectable({ providedIn: 'root' })

export class InboundService {

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
  private inbound$ = signal<inboundI[]>([]);
  private loadingInbound$ = signal<boolean>(false);

  public inbound = computed(() => this.inbound$());
  public loadingInbound = computed(() => this.loadingInbound$());

  public getInbound() {
    this.loadingInbound$.set(true); // comienza cargando

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/inventory-entries`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.inbound$.set(res.data);
        this.loadingInbound$.set(false); // terminó de cargar
      },
      error: () => {
        this.loadingInbound$.set(false); // aunque falle, quita el loading
      }
    });
  }

  // public getinboundDispatch() {
  //   return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/barber-dispatch`, this.header))
  //     .subscribe((res: any) => { this.inboundDis$.set(res.data); console.log(res);
  //     });
  // }

  public postInbound(inbound: any) { //InboundPostIT
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/inventory-entries`, inbound, this.header,));
  }

  // public postinboundDispatch(inbound: inboundPostI) {
  //   return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/barber-dispatch`, inbound, this.header, ));
  // }

  public putInbound(inbound: any) { //InboundPostI
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/inventory-entries/${inbound.id}`, inbound, this.header,));
  }

  public deleteInbound(inbound: number) {
    return this.requestHelper.handleRequest(() => this.http.delete(`${this.baseURL}/inventory-entries/${inbound}`, this.header,));
  }
}
