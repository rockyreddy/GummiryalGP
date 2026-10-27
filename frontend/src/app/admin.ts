import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService, Complaint, Notice } from './api.service';
import { AuthService } from './auth';
import { LangService } from './i18n';

@Component({
  standalone: true, imports: [FormsModule],
  template: `
  <div class="wrap" style="max-width:420px">
    <form class="card" style="margin-top:40px" (ngSubmit)="go()">
      <h2>{{ lang.t('a.login') }}</h2>
      <input name="u" [(ngModel)]="user" [placeholder]="lang.t('a.user')" autocomplete="username" required>
      <input name="p" type="password" [(ngModel)]="pass" [placeholder]="lang.t('a.pass')" autocomplete="current-password" required>
      <button class="btn">{{ lang.t('a.signin') }}</button>
      @if (bad) { <p class="err">{{ lang.t('a.bad') }}</p> }
    </form>
  </div>`,
})
export class AdminLoginComponent {
  lang = inject(LangService); private auth = inject(AuthService); private router = inject(Router);
  user = ''; pass = ''; bad = false;
  go() { this.bad = false; this.auth.login(this.user, this.pass).subscribe({ next: () => this.router.navigate(['/admin']), error: () => (this.bad = true) }); }
}

const blank = (): Notice => ({ category: 'Gram Sabha', titleEn: '', titleTe: '', bodyEn: '', bodyTe: '', date: new Date().toISOString().slice(0, 10) });

@Component({
  standalone: true, imports: [FormsModule, DatePipe],
  template: `
  <div class="wrap">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-top:24px">
      <h2>{{ lang.t('a.panel') }}</h2><button class="btn" (click)="logout()">{{ lang.t('a.logout') }}</button>
    </div>
    <div class="tabs">
      @for (t of tabs; track t) { <button [class.on]="tab() === t" (click)="tab.set(t)">{{ lang.t('a.' + t) }}</button> }
    </div>
    @if (msg) { <p class="err">{{ msg }}</p> }

    @if (tab() === 'complaints') {
      <div class="grid">
        @for (c of complaints(); track c.id) {
          <div class="card">
            <b>{{ c.ticketNo }}</b> · {{ lang.cat(c.category) }} · {{ lang.t('w') }} {{ c.ward }} · {{ c.createdAt | date:'mediumDate':undefined:lang.lang() }}
            <p>{{ c.description }}</p>
            <textarea [(ngModel)]="c.descriptionTe" [placeholder]="lang.t('a.te')"></textarea>
            <button class="btn" (click)="saveTe(c)">{{ lang.t('a.save') }}</button><br>
            <small>{{ lang.t('a.reporter') }}: {{ c.name }} {{ c.phone }}</small>
            <select [ngModel]="c.status" (ngModelChange)="status(c, $event)">
              @for (s of statuses; track s) { <option [value]="s">{{ lang.t('st.' + s) }}</option> }
            </select>
            <button class="btn red" (click)="delComplaint(c)">{{ lang.t('a.delete') }}</button>
          </div> }
      </div>
    }

    @if (tab() === 'notices') {
      <div class="grid">
        <form class="card" (ngSubmit)="saveNotice()">
          <h3>{{ lang.t('a.new') }}</h3>
          <input name="cat" [(ngModel)]="n.category" [placeholder]="lang.t('a.cat')" required>
          <input name="te" [(ngModel)]="n.titleEn" [placeholder]="lang.t('a.titleEn')" required>
          <input name="tt" [(ngModel)]="n.titleTe" [placeholder]="lang.t('a.titleTe')" required>
          <textarea name="be" [(ngModel)]="n.bodyEn" [placeholder]="lang.t('a.bodyEn')"></textarea>
          <textarea name="bt" [(ngModel)]="n.bodyTe" [placeholder]="lang.t('a.bodyTe')"></textarea>
          <input name="d" type="date" [(ngModel)]="n.date" required>
          <button class="btn">{{ lang.t('a.save') }}</button>
        </form>
        @for (x of notices(); track x.id) {
          <div class="card"><span class="tag">{{ lang.cat(x.category) }}</span><h4>{{ x.titleEn }}</h4><h4>{{ x.titleTe }}</h4><small>{{ x.date | date:'mediumDate':undefined:lang.lang() }}</small><br>
            <button class="btn" (click)="edit(x)">{{ lang.t('a.edit') }}</button>
            <button class="btn red" (click)="delNotice(x)">{{ lang.t('a.delete') }}</button></div> }
      </div>
    }

    @if (tab() === 'account') {
      <form class="card" style="max-width:420px" (ngSubmit)="changePass()">
        <input name="np" type="password" [(ngModel)]="newPass" [placeholder]="lang.t('a.newpass')" minlength="8" required>
        <button class="btn">{{ lang.t('a.save') }}</button>
      </form>
    }
  </div>`,
})
export class AdminComponent implements OnInit {
  lang = inject(LangService); private api = inject(ApiService); private auth = inject(AuthService); private router = inject(Router);
  tabs = ['complaints', 'notices', 'account']; statuses = ['RECEIVED', 'IN_PROGRESS', 'RESOLVED'];
  tab = signal('complaints'); complaints = signal<Complaint[]>([]); notices = signal<Notice[]>([]);
  n: Notice = blank(); newPass = ''; msg = '';
  private fail = () => (this.msg = this.lang.t('a.error'));
  ngOnInit() { this.loadC(); this.loadN(); }
  loadC() { this.api.adminComplaints().subscribe(c => this.complaints.set(c)); }
  loadN() { this.api.notices().subscribe(n => this.notices.set(n)); }
  status(c: Complaint, s: string) { this.api.setStatus(c.id!, s).subscribe({ next: () => this.loadC(), error: this.fail }); }
  saveTe(c: Complaint) { this.api.setTranslation(c.id!, c.descriptionTe ?? '').subscribe({ next: () => this.loadC(), error: this.fail }); }
  delComplaint(c: Complaint) { if (confirm(this.lang.t('a.confirm'))) this.api.delComplaint(c.id!).subscribe({ next: () => this.loadC(), error: this.fail }); }
  edit(x: Notice) { this.n = { ...x }; }
  saveNotice() { this.api.saveNotice(this.n).subscribe({ next: () => { this.n = blank(); this.loadN(); }, error: this.fail }); }
  delNotice(x: Notice) { if (confirm(this.lang.t('a.confirm'))) this.api.delNotice(x.id!).subscribe({ next: () => this.loadN(), error: this.fail }); }
  changePass() { this.api.changePassword(this.newPass).subscribe({ next: () => { this.auth.logout(); alert(this.lang.t('a.changed')); this.router.navigate(['/admin/login']); }, error: this.fail }); }
  logout() { this.auth.logout(); this.router.navigate(['/']); }
}
