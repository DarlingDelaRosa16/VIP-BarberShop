import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { ServiceGetI, ServicePostI } from '../interface/services.interface';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';

@Injectable({providedIn: 'root'})

export class ServicesService {

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

  private services$ = signal<ServiceGetI[]>([])
  public services = computed(() => this.services$())

  public getServices() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/servicios`, this.header))
      .subscribe((res: any) => { this.services$.set(res.data); });
  }

  public postServices(service: ServicePostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/servicios`, service, this.header, ));
  }

  public putService(service: ServicePostI) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/servicios/${service.id}`, service, this.header, ));
  }
}
