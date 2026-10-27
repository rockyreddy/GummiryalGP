import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ApiService, Complaint, Notice } from './api.service';
import { LangService } from './i18n';
import { INFO } from './info-data';

const SERVICES = ['complaints', 'notices', 'schemes', 'utilities', 'farmer', 'transparency'];
const CATS = ['Road', 'Water', 'Drain', 'Streetlight', 'Garbage', 'Other'];

@Component({
  standalone: true, imports: [RouterLink, DatePipe],
  template: `
  <section style="background:linear-gradient(135deg,var(--green),var(--dark));color:#fff;padding:72px 0;text-align:center">
    <div class="wrap">
      <h1 style="font-size:40px;margin:8px 0">{{ lang.t('site.name') }}</h1>
      <p>{{ lang.t('hero.tag') }}</p>
      <a class="btn" routerLink="/complaints">{{ lang.t('hero.report') }}</a> &nbsp; <a class="btn alt" routerLink="/notices">{{ lang.t('hero.notices') }}</a>
    </div>
  </section>
  <div style="background:var(--gold);padding:8px 0;font-size:14px"><div class="wrap">📣 {{ lang.t('ticker') }}</div></div>
  <div class="wrap">
    <div class="grid" style="margin-top:24px;text-align:center">
      <div class="card"><h2>{{ stats()?.resolved ?? 0 }}</h2>{{ lang.t('stat.resolved') }}</div>
      <div class="card"><h2>{{ stats()?.total ?? 0 }}</h2>{{ lang.t('stat.total') }}</div>
      <div class="card"><h2>{{ stats()?.notices ?? 0 }}</h2>{{ lang.t('stat.notices') }}</div>
    </div>
    <h2 class="sec">{{ lang.t('sec.services') }}</h2>
    <div class="grid">
      @for (s of services; track s) { <a class="card" [routerLink]="'/' + s"><h3>{{ lang.t('svc.' + s) }}</h3><p>{{ lang.t('svc.' + s + '.d') }}</p></a> }
    </div>
    <h2 class="sec">{{ lang.t('sec.recent') }}</h2>
    <div class="grid">
      @for (c of complaints(); track c.ticketNo) {
        <div class="card"><span class="tag {{ c.status }}">{{ lang.t('st.' + c.status) }}</span>
          <h4>{{ lang.pick(c.description, c.descriptionTe) }}</h4><small>{{ c.ticketNo }} · {{ lang.t('w') }} {{ c.ward }} · {{ c.createdAt | date:'mediumDate':undefined:lang.lang() }}</small></div> }
    </div>
    <h2 class="sec">{{ lang.t('sec.latest') }}</h2>
    <div class="grid">
      @for (n of notices().slice(0, 3); track n.id) {
        <div class="card"><span class="tag">{{ lang.cat(n.category) }}</span><h4>{{ lang.pick(n.titleEn, n.titleTe) }}</h4><p>{{ lang.pick(n.bodyEn, n.bodyTe) }}</p><small>{{ n.date | date:'mediumDate':undefined:lang.lang() }}</small></div> }
    </div>
  </div>`,
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  lang = inject(LangService);
  services = SERVICES; stats = signal<any>(null); complaints = signal<Complaint[]>([]); notices = signal<Notice[]>([]);
  ngOnInit() {
    this.api.stats().subscribe(s => this.stats.set(s));
    this.api.complaints().subscribe(c => this.complaints.set(c.slice(0, 6)));
    this.api.notices().subscribe(n => this.notices.set(n));
  }
}

@Component({
  standalone: true, imports: [FormsModule, DatePipe],
  template: `
  <div class="wrap">
    <h2 class="sec">{{ lang.t('c.title') }}</h2>
    <div class="grid">
      <form class="card" (ngSubmit)="submit()" #f="ngForm">
        <h3>{{ lang.t('c.report') }}</h3>
        <select name="category" [(ngModel)]="form.category" required>
          @for (c of cats; track c) { <option [value]="c">{{ lang.cat(c) }}</option> }
        </select>
        <textarea name="description" [(ngModel)]="form.description" [placeholder]="lang.t('c.desc')" required></textarea>
        <input name="ward" type="number" min="1" max="30" [(ngModel)]="form.ward" [placeholder]="lang.t('c.ward')" required>
        <input name="name" [(ngModel)]="form.name" [placeholder]="lang.t('c.name')" required>
        <input name="phone" [(ngModel)]="form.phone" [placeholder]="lang.t('c.phone')">
        <button class="btn" [disabled]="f.invalid">{{ lang.t('c.submit') }}</button>
        @if (ticket) { <p><b>{{ lang.t('c.ticket') }} {{ ticket }}</b> — {{ lang.t('c.keep') }}</p> }
      </form>
      <div class="card">
        <h3>{{ lang.t('c.track') }}</h3>
        <input [(ngModel)]="q" placeholder="GUM-2026-0001">
        <button class="btn" (click)="track()">{{ lang.t('c.trackbtn') }}</button>
        @if (found) { <p><span class="tag {{ found.status }}">{{ lang.t('st.' + found.status) }}</span> {{ lang.pick(found.description, found.descriptionTe) }} ({{ lang.t('w') }} {{ found.ward }})</p> }
        @if (notFound) { <p>{{ lang.t('c.none') }}</p> }
      </div>
    </div>
    <h2 class="sec">{{ lang.t('c.recent') }}</h2>
    <div class="grid">
      @for (c of list; track c.ticketNo) {
        <div class="card"><span class="tag {{ c.status }}">{{ lang.t('st.' + c.status) }}</span><h4>{{ lang.pick(c.description, c.descriptionTe) }}</h4>
        <small>{{ c.ticketNo }} · {{ lang.cat(c.category) }} · {{ lang.t('w') }} {{ c.ward }} · {{ c.createdAt | date:'mediumDate':undefined:lang.lang() }}</small></div> }
    </div>
  </div>`,
})
export class ComplaintsComponent implements OnInit {
  private api = inject(ApiService);
  lang = inject(LangService);
  cats = CATS;
  form: Complaint = { category: 'Road', description: '', ward: 1, name: '', phone: '' };
  list: Complaint[] = []; ticket = ''; q = ''; found?: Complaint; notFound = false;
  ngOnInit() { this.load(); }
  load() { this.api.complaints().subscribe(c => (this.list = c)); }
  submit() { this.api.create(this.form).subscribe(c => { this.ticket = c.ticketNo!; this.form = { category: 'Road', description: '', ward: 1, name: '', phone: '' }; this.load(); }); }
  track() { this.found = undefined; this.notFound = false;
    this.api.track(this.q.trim()).subscribe({ next: c => (this.found = c), error: () => (this.notFound = true) }); }
}

@Component({
  standalone: true, imports: [DatePipe],
  template: `<div class="wrap"><h2 class="sec">{{ lang.t('sec.notices') }}</h2><div class="grid">
    @for (n of notices(); track n.id) {
      <div class="card"><span class="tag">{{ lang.cat(n.category) }}</span><h3>{{ lang.pick(n.titleEn, n.titleTe) }}</h3><p>{{ lang.pick(n.bodyEn, n.bodyTe) }}</p><small>{{ n.date | date:'mediumDate':undefined:lang.lang() }}</small></div> }
  </div></div>`,
})
export class NoticesComponent implements OnInit {
  notices = signal<Notice[]>([]);
  lang = inject(LangService);
  private api = inject(ApiService);
  ngOnInit() { this.api.notices().subscribe(n => this.notices.set(n)); }
}

@Component({
  standalone: true,
  template: `<div class="wrap"><h2 class="sec">{{ lang.pick(page.t[0], page.t[1]) }}</h2><p>{{ lang.pick(page.i[0], page.i[1]) }}</p><div class="grid">
    @for (i of page.items; track i[0]) { <div class="card"><h3>{{ lang.pick(i[0], i[2]) }}</h3><p>{{ lang.pick(i[1], i[3]) }}</p></div> }</div></div>`,
})
export class InfoComponent {
  lang = inject(LangService);
  page = INFO[inject(ActivatedRoute).snapshot.data['key']];
}
