import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../services/general.service';
import { RequestHelperService } from '../../../../services/requestHelper.service';
import { DatesGetI, DatesPostI } from '../interface/barbershop.interface';

@Injectable({providedIn: 'root'})

export class BarbershopService {

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

  private dates$ = signal<DatesGetI[]>([])
  public dates = computed(() => this.dates$())

  public getDates() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/appointments`, this.header))
      .subscribe((res: any) => { this.dates$.set(res.data); console.log(res.data);
       });
  }

 public getDatesSS() {
  return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/appointments`, this.header));
}

  public postDates(dates: DatesPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/appointments`, dates, this.header, ));
  }

  public putDateStatus(idDates: number) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/appointments/${idDates}/status`, {status: "Completado"}, this.header, ));
  }

  public deleteDateStatus(idDates: number) {
    return this.requestHelper.handleRequest(() => this.http.delete(`${this.baseURL}/appointments/${idDates}`, this.header ));
  }
}
