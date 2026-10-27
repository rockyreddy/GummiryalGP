import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LangService } from './i18n';

@Component({
  selector: 'app-root', standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
  <header style="background:var(--dark);color:#fff">
    <div class="wrap" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding:12px 16px">
      <a routerLink="/" style="font-weight:700;font-size:20px">🌾 {{ lang.t('site.name') }}</a>
      <nav style="display:flex;gap:16px;flex-wrap:wrap;font-size:14px;align-items:center">
        @for (n of nav; track n) { <a [routerLink]="n === 'home' ? '/' : '/' + n" routerLinkActive="act" [routerLinkActiveOptions]="{exact:true}">{{ lang.t('nav.' + n) }}</a> }
        <span class="lang">
          <button [class.on]="lang.lang() === 'en'" (click)="lang.set('en')">EN</button>
          <button [class.on]="lang.lang() === 'te'" (click)="lang.set('te')">తె</button>
        </span>
      </nav>
    </div>
  </header>
  <router-outlet />
  <footer style="background:var(--dark);color:#cfe;margin-top:48px;padding:24px 0;font-size:14px">
    <div class="wrap">{{ lang.t('f.text') }} · <a routerLink="/admin" style="text-decoration:underline">{{ lang.t('nav.admin') }}</a></div>
  </footer>`,
  styles: [`.act { color: var(--gold); font-weight: 600; }`],
})
export class AppComponent {
  lang = inject(LangService);
  nav = ['home', 'complaints', 'notices', 'schemes', 'utilities', 'farmer', 'transparency', 'contact'];
}
