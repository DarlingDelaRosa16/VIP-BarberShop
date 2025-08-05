// src/app/calendar.config.ts
import { importProvidersFrom } from '@angular/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

export const calendarProviders = [
  importProvidersFrom(CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }))
];
