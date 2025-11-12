import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../services/general.service';
import { RequestHelperService } from '../../../../services/requestHelper.service';

@Injectable({ providedIn: 'root' })

export class ShiftService {

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

  private shift$ = signal<any>([]);
  private loadingShift$ = signal<boolean>(false);

  public shift = computed(() => this.shift$());
  public loadingShift = computed(() => this.loadingShift$());

  private shiftLunch$ = signal<any>([]);
  private loadingLunchShift$ = signal<boolean>(false);

  public shiftLunch = computed(() => this.shiftLunch$());
  public loadingLunchShift = computed(() => this.loadingShift$());

  public getShiftByBarber(barber_id: number) {
    this.loadingShift$.set(true); // empieza cargando

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/barbers/schedules?barber_id=${barber_id}`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.shift$.set(res.data);
        this.loadingShift$.set(false); // terminó de cargar
      },
      error: () => {
        this.loadingShift$.set(false); // aunque falle, quitamos el loading
      }
    });
  }

  public getShiftLunchByBarber(barber_id: number) {
    this.loadingLunchShift$.set(true); // empieza cargando

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/barbers/lunch_time/${barber_id}`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.shiftLunch$.set(res);
        this.loadingLunchShift$.set(false); // terminó de cargar
      },
      error: () => {
        this.loadingLunchShift$.set(false); // aunque falle, quitamos el loading
      }
    });
  }

  public putShift(barberId: number, shift: any) {
    return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/barbers/schedules/${barberId}`, shift, this.header,));
  }

  public editStatus(id: number) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/schedules/toggle-status`, {id: id}, this.header,));
  }
}
