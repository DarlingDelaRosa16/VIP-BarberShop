import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../layout/services/general.service';
import { RequestHelperService } from '../../../layout/services/requestHelper.service';
import { LogInI } from '../interface/logIn.interface';

@Injectable({providedIn: 'root'})

export class LogInService {

  // private token: string;
  private baseURL: string;
  // private headers: HttpHeaders;
  // private header: { headers: HttpHeaders };

  constructor(
    private http: HttpClient,
    private systemInformation: SystemInformationService,
    private requestHelper: RequestHelperService
  ) {
    // this.token = this.systemInformation.getToken;
    this.baseURL = this.systemInformation.getURL;
    // this.headers = new HttpHeaders({ 'Authorization': this.token });
    // this.header = { headers: this.headers };
  }

  // private services$ = signal<ServiceGetI[]>([])
  // public services = computed(() => this.services$())

  // public getServices() {
  //   return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/servicios`, this.header))
  //     .subscribe((res: any) => { this.services$.set(res.data); });
  // }

  public postLogIn(user: LogInI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/login`, user ));
  }

  // public putService(service: ServicePostI) {
  //   return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/servicios/${service.id}`, service, this.header, ));
  // }
}
