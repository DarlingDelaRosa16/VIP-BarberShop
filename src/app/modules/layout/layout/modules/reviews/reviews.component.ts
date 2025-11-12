import { Component, effect, EnvironmentInjector, inject, OnInit } from '@angular/core';
import { MaterialComponents } from '../../../../../helpers/material';
import { PrimeComponentsModules } from '../../../../../helpers/primeNg';
import { ModulesImports } from '../../../../../helpers/modulesImports';
import { ReviewService } from './services/reviews.service';
import { BabersService } from '../configurations/configurationOptions/barbers/services/barbers.service';
import { ClientService } from '../configurations/configurationOptions/clients/services/clients.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  imports: [MaterialComponents, PrimeComponentsModules, ModulesImports],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css',
  providers: [MessageService]
})
export class ReviewsComponent implements OnInit {

  private injector = inject(EnvironmentInjector);
  people: any[] = [];
  ReviewsFilterForm: FormGroup;
  rangeDates!: Date[];

  toggleCalifications: boolean = true
  totalReviews: number = 0
  averageCalification: number = 0
  cantBarberos: number = 0
  bestBarber: string = ''
  ratings!: { stars: number, count: number, percent: number }[]
  reviews: any[] = []

  cantFiveStart: number = 0
  cantFourStart: number = 0
  cantThreeStart: number = 0
  cantTwoStart: number = 0
  cantOneStart: number = 0

  constructor(
    public fb: FormBuilder,
    public reviewService: ReviewService,
    public barberService: BabersService,
    public clientService: ClientService,
    private messageService: MessageService,
  ) {
    this.ReviewsFilterForm = this.fb.group({
      name: new FormControl(null),
      state: new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.reviewService.getReviewBarber();
    this.barberService.getBarbers()
    this.clientService.getClients()

    this.injector.runInContext(() => {
      effect(() => {

        const barberos = this.barberService.barbers();
        const clientes = this.clientService.clients();

        this.people = [...clientes, ...barberos];

        this.reviews = this.reviewService.review(); // tu signal con los reviews

        if (!this.reviews || this.reviews.length === 0) {
          this.totalReviews = 0;
          this.averageCalification = 0;
          this.cantBarberos = 0;
          this.bestBarber = '';
          this.cantFiveStart = 0;
          this.cantFourStart = 0;
          this.cantThreeStart = 0;
          this.cantTwoStart = 0;
          this.cantOneStart = 0;
          this.ratings = [
            { stars: 5, count: 0, percent: 0 },
            { stars: 4, count: 0, percent: 0 },
            { stars: 3, count: 0, percent: 0 },
            { stars: 2, count: 0, percent: 0 },
            { stars: 1, count: 0, percent: 0 }
          ];
          return;
        }

        // Total de reviews
        this.totalReviews = this.reviews.length;

        // Calificación promedio
        const sum = this.reviews.reduce((acc: any, r: any) => acc + r.rating, 0);
        this.averageCalification = sum / this.reviews.length;

        // Barberos únicos
        const uniqueBarbers = new Set(this.reviews.map((r: any) => r.barber));
        this.cantBarberos = uniqueBarbers.size;

        // Mejor barbero (con promedio más alto)
        const barberStats: { [barber: string]: { total: number; count: number } } = {};
        this.reviews.forEach((r: any) => {
          if (!barberStats[r.barber]) {
            barberStats[r.barber] = { total: 0, count: 0 };
          }
          barberStats[r.barber].total += r.rating;
          barberStats[r.barber].count += 1;
        });
        let best = '';
        let bestAvg = 0;
        for (const barber in barberStats) {
          const avg = barberStats[barber].total / barberStats[barber].count;
          if (avg > bestAvg) {
            bestAvg = avg;
            best = barber;
          }
        }
        this.bestBarber = best;

        // Cantidad de reviews por estrellas
        this.cantFiveStart = this.reviews.filter((r: any) => r.rating === 5).length;
        this.cantFourStart = this.reviews.filter((r: any) => r.rating === 4).length;
        this.cantThreeStart = this.reviews.filter((r: any) => r.rating === 3).length;
        this.cantTwoStart = this.reviews.filter((r: any) => r.rating === 2).length;
        this.cantOneStart = this.reviews.filter((r: any) => r.rating === 1).length;

        // Construcción del array ratings
        this.ratings = [
          { stars: 5, count: this.cantFiveStart, percent: Math.round((this.cantFiveStart / this.totalReviews) * 100) },
          { stars: 4, count: this.cantFourStart, percent: Math.round((this.cantFourStart / this.totalReviews) * 100) },
          { stars: 3, count: this.cantThreeStart, percent: Math.round((this.cantThreeStart / this.totalReviews) * 100) },
          { stars: 2, count: this.cantTwoStart, percent: Math.round((this.cantTwoStart / this.totalReviews) * 100) },
          { stars: 1, count: this.cantOneStart, percent: Math.round((this.cantOneStart / this.totalReviews) * 100) }
        ];
      });
    });
  }

  clearForm() {
    this.ReviewsFilterForm.reset()
    this.rangeDates = []
    this.reviews = this.reviewService.review();
  }

  filterDate(): void {
    const formValue = this.ReviewsFilterForm.value;
    const selectedPerson = formValue.name;

    let filteredDates = [...this.reviewService.review()];

    // 🔹 Filtrar por persona
    if (selectedPerson) {
      const fullName = `${selectedPerson.first_name} ${selectedPerson.last_name}`.toLowerCase();

      filteredDates = filteredDates.filter((cita: any) =>
        cita.client.toLowerCase().includes(fullName) ||
        cita.barber.toLowerCase().includes(fullName)
      );
    }

    // 🔹 Filtrar por rango de fecha
    if (this.rangeDates && this.rangeDates[1] != null) {
      const [startDate, endDate] = this.rangeDates;
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(23, 59, 59, 999);

      filteredDates = filteredDates.filter((cita: any) => {
        const citaDate = new Date(cita.created_at).getTime();
        return citaDate >= start && citaDate <= end;
      });
    }

    this.reviews = filteredDates;

    // 🔹 Mensajes si no hay resultados
    if (this.reviews.length === 0) {
      if (selectedPerson) {
        const etiqueta =
          selectedPerson.role_id === 2 ? 'barbero' :
            selectedPerson.role_id === 3 ? 'cliente' : '';
        const texto = etiqueta
          ? `No hay reseñas del ${etiqueta} ${selectedPerson.first_name} ${selectedPerson.last_name}`
          : `No hay reseñas de ${selectedPerson.first_name} ${selectedPerson.last_name}`;
        this.messageService.add({ severity: 'info', summary: 'Info', detail: texto, life: 4000 });
      } else if (this.rangeDates && this.rangeDates[1] != null) {
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: `No hay reseñas dentro del rango de fechas seleccionado`,
          life: 4000
        });
      }
    }
  }
}
