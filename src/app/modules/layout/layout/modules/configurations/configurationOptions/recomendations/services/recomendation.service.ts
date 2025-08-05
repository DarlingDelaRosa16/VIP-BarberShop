import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../../../services/general.service';
import { RequestHelperService } from '../../../../../../services/requestHelper.service';
import { RecomendationPostI } from '../interfaces/recomendation.interface';

@Injectable({providedIn: 'root'})

export class RecomendationService {

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

  private recomendation$ = signal<any>([])
  public recomendation = computed(() => this.recomendation$())

  public getRecomendation() {
    return this.requestHelper.handleRequest(() => this.http.get(`${this.baseURL}/care-tips`, this.header))
      .subscribe((res: any) => { this.recomendation$.set(res.data);  console.log(res);
      });
  }

  public postRecomendation(recomendation: RecomendationPostI) {
    return this.requestHelper.handleRequest(() => this.http.post(`${this.baseURL}/care-tips`, recomendation, this.header, ));
  }

  public putRecomendation(recomendation: RecomendationPostI) {
    // return this.requestHelper.handleRequest(() => this.http.put(`${this.baseURL}/servicios/${recomendation.id}`, recomendation, this.header, ));
  }
}
