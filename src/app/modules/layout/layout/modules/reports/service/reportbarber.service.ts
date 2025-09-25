import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../services/general.service';
import { RequestHelperService } from '../../../../services/requestHelper.service';

@Injectable({ providedIn: 'root' })

export class BabersReportService {

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

  private barbersReport$ = signal<any>({})
  public barbersReport = computed(() => this.barbersReport$())

  private productLowStockReport$ = signal<any[]>([]);
  private loadingProductLowStock$ = signal<boolean>(false);

  // Computed
  public productLowStockReport = computed(() => this.productLowStockReport$());
  public loadingProductLowStock = computed(() => this.loadingProductLowStock$());
  // private barbersSlots$ = signal<BarberSlots[]>([])
  // public barbersSlots = computed(() => this.barbersSlots$())

  public getBarbersReport(barberReport: any) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/barbers/report`, barberReport, this.header))
    // .subscribe((res: any) => { this.barbersReport$.set(res.data); console.log(res);
    // });
  }

  public getBarbersReportSetDate(barberReport: any) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/barbers/report`, barberReport, this.header))
    // .subscribe((res: any) => { this.barbersReport$.set(res.data); console.log(res);
    // });
  }

  // Service
  public getLowStockProducts() {
    this.loadingProductLowStock$.set(true); // comienza cargando

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/products-low-stock`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.productLowStockReport$.set(res.data);
        this.loadingProductLowStock$.set(false); // terminó de cargar
        console.log(res);
      },
      error: () => {
        this.loadingProductLowStock$.set(false); // aunque falle, quita el loading
      }
    });
  }

  // public putBarber(service: BarberPostI) {
  //   return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/servicios`, service, this.header, ));
  // }
}
