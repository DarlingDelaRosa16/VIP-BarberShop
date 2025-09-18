import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestHelperService } from '../../services/requestHelper.service';
import { SystemInformationService } from '../../services/general.service';
import { DailyI, MonthlyIncome, PersonPostI, PopularServicesI, RolI } from '../interface/general.Interface';

@Injectable({ providedIn: 'root' })

export class GeneralRequestService {

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

  private rol$ = signal<RolI[]>([])
  public rol = computed(() => this.rol$())

  private daily$ = signal<DailyI>({
    total_scheduled: 0,
    total_completed: 0,
    total_income: 0,
    active_barbers: 0,
    errorCode: ''
  })

  private popular$ = signal<PopularServicesI[]>([])
  private mounthlyIncome$ = signal<MonthlyIncome[]>([])

  public daily = computed(() => this.daily$())
  public popular = computed(() => this.popular$())
  public mounthlyIncome = computed(() => this.mounthlyIncome$())

  public getRol() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/roles`, this.header))
      .subscribe((res: any) => { this.rol$.set(res); });
  }

  public postRegister(service: PersonPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/register`, service, this.header,))
  }

  public getDaily() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/reports/daily-summary`, this.header,))
      .subscribe((res: any) => { this.daily$.set(res); });
  }

  public getPopularServices() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/reports/popular-services`, this.header,))
      .subscribe((res: any) => { this.popular$.set(res.data);
       });
  }

  public getMonthlyIncome() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/reports/yearly-income`, this.header,))
      .subscribe((res: any) => { this.mounthlyIncome$.set(res);
      });
  }
}
