import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';
import { PersonGetI } from '../../../../../interface/general.Interface';
import { BarberSlots } from '../interface/barbers.interface';

@Injectable({providedIn: 'root'})

export class BabersService {

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

  private barbers$ = signal<PersonGetI[]>([])
  public barbers = computed(() => this.barbers$())

  private barbersSlots$ = signal<BarberSlots[]>([])
  public barbersSlots = computed(() => this.barbersSlots$())

  public getBarbers() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/barbers`, this.header))
      .subscribe((res: any) => { this.barbers$.set(res.data); ;
      });
  }

  public getAvaliableSlotsBarbers(barber: BarberSlots) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/barbers/availableSlots`, barber, this.header))
      // .subscribe((res: any) => { this.barbersSlots$.set(res.data); console.log(res); });
  }
  // public putBarber(service: BarberPostI) {
  //   return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/servicios`, service, this.header, ));
  // }
}
