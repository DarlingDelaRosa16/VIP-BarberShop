import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemInformationService } from '../../../../services/general.service';
import { RequestHelperService } from '../../../../services/requestHelper.service';

@Injectable({ providedIn: 'root' })

export class ReviewService {

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

  private review$ = signal<any>([]);
  private loadingReview$ = signal<boolean>(false);

  public review = computed(() => this.review$());
  public loadingReview = computed(() => this.loadingReview$());

  public getReviewBarber() {
    this.loadingReview$.set(true);

    this.requestHelper.handleRequest(() =>
      this.http.get(`${this.baseURL}/barber-reviews`, this.header)
    ).subscribe({
      next: (res: any) => {
        this.review$.set(res.data);
        this.loadingReview$.set(false);
      },
      error: () => {
        this.loadingReview$.set(false);
      }
    });
  }
}
