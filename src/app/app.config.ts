import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import aura from '@primeng/themes/aura';
import lara from '@primeng/themes/lara';
import material from '@primeng/themes/material';
import nora from '@primeng/themes/nora';
import { HttpClientModule } from '@angular/common/http';
import { calendarProviders } from './calendar.config';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme:{
        preset: lara,
        options: {
          darkModeSelector: false || 'none'
      }
      }
    }),
    importProvidersFrom( HttpClientModule),
    ...calendarProviders
  ]
};
