import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  header = signal<string | null>(sessionStorage.getItem('adm')); // cleared when the tab closes
  loggedIn = computed(() => !!this.header());
  login(user: string, pass: string) {
    const h = 'Basic ' + btoa(unescape(encodeURIComponent(`${user}:${pass}`)));
    return this.http.get('/api/admin/me', { headers: { Authorization: h } })
      .pipe(tap(() => { sessionStorage.setItem('adm', h); this.header.set(h); }));
  }
  logout() { sessionStorage.removeItem('adm'); this.header.set(null); }
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService), router = inject(Router), h = auth.header();
  const isAdmin = req.url.startsWith('/api/admin') && h;
  return next(isAdmin ? req.clone({ setHeaders: { Authorization: h! } }) : req).pipe(
    catchError(e => { if (isAdmin && e.status === 401) { auth.logout(); router.navigate(['/admin/login']); } return throwError(() => e); }));
};

export const adminGuard: CanActivateFn = () => inject(AuthService).loggedIn() || inject(Router).createUrlTree(['/admin/login']);
