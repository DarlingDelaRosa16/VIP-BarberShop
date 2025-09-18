import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../services/general.service';
import { RequestHelperService } from '../../../../services/requestHelper.service';
import { DatesGetI, DatesPostI } from '../interface/barbershop.interface';

@Injectable({ providedIn: 'root' })

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

  private dates$ = signal<DatesGetI[]>([]);
  private datesWk$ = signal<DatesGetI[]>([]);
  private loadingDates$ = signal<boolean>(false);
  private loadingDatesWK$ = signal<boolean>(false);

  // Computeds públicos
  public dates = computed(() => this.dates$());
  public datesWk = computed(() => this.datesWk$());
  public loadingDates = computed(() => this.loadingDates$());
  public loadingDatesWK = computed(() => this.loadingDatesWK$());

  // Método para traer citas con loading
  public getDates(name: string = '', status_id: number = 0, start_date: string = '',  end_date: string = '') {
    this.loadingDates$.set(true);

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/appointments?name=${name}&start_date=${start_date}&end_date${end_date}&status_id${status_id }, `, this.header)
    ).subscribe({
      next: (res: any) => {
        this.dates$.set(res.data);
        this.loadingDates$.set(false);
      },
      error: () => {
        this.dates$.set([]);
        this.loadingDates$.set(false);
      }
    });
  }

  public getDatesWeekly() {
    this.loadingDatesWK$.set(true);

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/appointments/weekly`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.datesWk$.set(res.data);
        this.loadingDatesWK$.set(false);
      },
      error: () => {
        this.datesWk$.set([]);
        this.loadingDatesWK$.set(false);
      }
    });
  }

  public getDatesSS() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/appointments`, this.header));
  }

  public postDates(dates: DatesPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/appointments`, dates, this.header,));
  }

   public putDates(dates: DatesPostI) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/appointments`, dates, this.header,));
  }

  public putDateStatus(idDates: number, status: number) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/appointments/${idDates}/status`, { status: status }, this.header,));
  }

  public deleteDateStatus(idDates: number) {
    return this.requestHelper.handleRequest(() => this.http.delete(`${this.baseURL}/appointments/${idDates}`, this.header));
  }
}
