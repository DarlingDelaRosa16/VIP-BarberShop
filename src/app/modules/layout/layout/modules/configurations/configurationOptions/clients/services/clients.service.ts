import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';
import { PersonGetI } from '../../../../../interface/general.Interface';

@Injectable({providedIn: 'root'})

export class ClientService {

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

  private client$ = signal<PersonGetI[]>([])
  public clients = computed(() => this.client$())

  public getClients() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/clients`, this.header))
      .subscribe((res: any) => { this.client$.set(res.data); });
  }

  // public putBarber(service: BarberPostI) {
  //   return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/servicios`, service, this.header, ));
  // }
}
