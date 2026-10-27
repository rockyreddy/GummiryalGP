import { ApplicationConfig } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeTe from '@angular/common/locales/te';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth';

registerLocaleData(localeTe); // lets the date pipe show Telugu dates
export const appConfig: ApplicationConfig =
{
  providers: [provideRouter(routes),
  provideHttpClient(withInterceptors([authInterceptor]))]
};
