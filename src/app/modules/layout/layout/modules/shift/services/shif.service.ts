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
}
