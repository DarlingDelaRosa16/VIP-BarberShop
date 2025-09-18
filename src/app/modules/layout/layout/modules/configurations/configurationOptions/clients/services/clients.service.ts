import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';
import { PersonGetI } from '../../../../../interface/general.Interface';

@Injectable({ providedIn: 'root' })

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

  private client$ = signal<PersonGetI[]>([]);
  private loading$ = signal<boolean>(false);

  public clients = computed(() => this.client$());
  public loading = computed(() => this.loading$());

  public getClients(name: string = '') {
    this.loading$.set(true); // comienza cargando

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/clients?name=${name}`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.client$.set(res.data);
        this.loading$.set(false); // terminó de cargar
      },
      error: () => {
        this.loading$.set(false); // aunque falle, quita el loading
      }
    });
  }


}
