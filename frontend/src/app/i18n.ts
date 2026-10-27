import { Injectable, signal } from '@angular/core';

type Dict = Record<string, string>;
// Add a key here once, with both languages. Missing Telugu falls back to English.
const EN: Dict = {
  'site.name': 'Gummiryal Gram Panchayat', 'nav.home': 'Home', 'nav.complaints': 'Complaints', 'nav.notices': 'Notices', 'nav.schemes': 'Schemes',
  'nav.utilities': 'Utilities', 'nav.farmer': 'Farmer Corner', 'nav.transparency': 'Transparency', 'nav.contact': 'Contact', 'nav.admin': 'Admin',
  'hero.tag': 'Your village, your voice — transparent governance, faster solutions.', 'hero.report': 'Report an Issue', 'hero.notices': 'View Notices',
  'ticker': 'Gram Sabha · Water supply 6–8 AM · Tax deadline Dec 31 (sample)',
  'stat.resolved': 'Issues resolved', 'stat.total': 'Issues reported', 'stat.notices': 'Notices',
  'sec.services': 'Everything Your Village Needs', 'sec.recent': 'Recent Issues', 'sec.latest': 'Latest Notices', 'sec.notices': 'Panchayat Notices',
  'svc.complaints': 'Complaint Tracker', 'svc.complaints.d': 'Report road, drain, water or streetlight issues and track the status.',
  'svc.notices': 'Notices', 'svc.notices.d': 'Gram Sabha dates, tax notices, tenders and works.',
  'svc.schemes': 'Schemes', 'svc.schemes.d': 'Pensions, job cards and certificate checklists.',
  'svc.utilities': 'Utilities & Emergency', 'svc.utilities.d': 'Water timings, emergency numbers and village directory.',
  'svc.farmer': 'Farmer Corner', 'svc.farmer.d': 'Market prices, weather and local services.',
  'svc.transparency': 'Transparency', 'svc.transparency.d': 'Funds received and works completed.',
  'c.title': 'Complaint Tracker', 'c.report': 'Report an issue', 'c.desc': 'Describe the issue', 'c.ward': 'Ward no.', 'c.name': 'Your name', 'c.phone': 'Phone (optional)',
  'c.submit': 'Submit', 'c.ticket': 'Your ticket:', 'c.keep': 'Keep it to track the status.', 'c.track': 'Track a ticket', 'c.trackbtn': 'Track', 'c.none': 'No ticket found.', 'c.recent': 'Recent complaints', 'w': 'Ward',
  'cat.Road': 'Road', 'cat.Water': 'Water', 'cat.Drain': 'Drain', 'cat.Streetlight': 'Streetlight', 'cat.Garbage': 'Garbage', 'cat.Other': 'Other',
  'cat.Gram Sabha': 'Gram Sabha', 'cat.Tax': 'Tax', 'cat.Tender': 'Tender',
  'st.RECEIVED': 'Received', 'st.IN_PROGRESS': 'In progress', 'st.RESOLVED': 'Resolved',
  'f.text': '© 2026 Gummiryal Gram Panchayat · Emergency: Ambulance 108 · Police 100',
  'a.login': 'Admin Login', 'a.user': 'Username', 'a.pass': 'Password', 'a.signin': 'Sign in', 'a.bad': 'Invalid username or password.', 'a.panel': 'Admin Panel',
  'a.logout': 'Log out', 'a.complaints': 'Complaints', 'a.notices': 'Notices', 'a.account': 'Account', 'a.delete': 'Delete', 'a.confirm': 'Delete this item?', 'a.save': 'Save',
  'a.edit': 'Edit', 'a.new': 'New / edit notice', 'a.titleEn': 'Title (English)', 'a.titleTe': 'Title (Telugu)', 'a.bodyEn': 'Details (English)', 'a.bodyTe': 'Details (Telugu)',
  'a.cat': 'Category', 'a.date': 'Date', 'a.newpass': 'New password (min 8 characters)', 'a.changed': 'Password changed. Please sign in again.', 'a.reporter': 'Reporter',
  'a.error': 'Something went wrong.', 'a.te': 'Telugu translation of the description'
};
const TE: Dict = {
  'site.name': 'గుమ్మిర్యాల్ గ్రామ పంచాయతీ', 'nav.home': 'హోమ్', 'nav.complaints': 'సమస్యలు', 'nav.notices': 'నోటీసులు', 'nav.schemes': 'పథకాలు',
  'nav.utilities': 'సేవలు', 'nav.farmer': 'రైతు మూల', 'nav.transparency': 'పారదర్శకత', 'nav.contact': 'సంప్రదింపు', 'nav.admin': 'అడ్మిన్',
  'hero.tag': 'మీ గ్రామం, మీ గొంతు — పారదర్శక పాలన, వేగవంతమైన పరిష్కారాలు.', 'hero.report': 'సమస్య నివేదించండి', 'hero.notices': 'నోటీసులు చూడండి',
  'ticker': 'గ్రామ సభ · నీటి సరఫరా ఉదయం 6–8 · పన్ను చెల్లింపు గడువు డిసెంబర్ 31 (నమూనా)',
  'stat.resolved': 'పరిష్కరించిన సమస్యలు', 'stat.total': 'నివేదించిన సమస్యలు', 'stat.notices': 'నోటీసులు',
  'sec.services': 'మీ గ్రామానికి కావలసినవన్నీ', 'sec.recent': 'ఇటీవలి సమస్యలు', 'sec.latest': 'తాజా నోటీసులు', 'sec.notices': 'పంచాయతీ నోటీసులు',
  'svc.complaints': 'సమస్యల ట్రాకర్', 'svc.complaints.d': 'రోడ్డు, కాలువ, నీరు, వీధి దీపాల సమస్యలను నివేదించి, స్థితిని ట్రాక్ చేయండి.',
  'svc.notices': 'నోటీసులు', 'svc.notices.d': 'గ్రామ సభ తేదీలు, పన్ను నోటీసులు, టెండర్లు, పనులు.',
  'svc.schemes': 'పథకాలు', 'svc.schemes.d': 'పింఛన్లు, జాబ్ కార్డులు, ధృవపత్రాల జాబితాలు.',
  'svc.utilities': 'సేవలు & అత్యవసరం', 'svc.utilities.d': 'నీటి సమయాలు, అత్యవసర నంబర్లు, గ్రామ డైరెక్టరీ.',
  'svc.farmer': 'రైతు మూల', 'svc.farmer.d': 'మార్కెట్ ధరలు, వాతావరణం, స్థానిక సేవలు.',
  'svc.transparency': 'పారదర్శకత', 'svc.transparency.d': 'అందిన నిధులు, పూర్తైన పనులు.',
  'c.title': 'సమస్యల ట్రాకర్', 'c.report': 'సమస్య నివేదించండి', 'c.desc': 'సమస్యను వివరించండి', 'c.ward': 'వార్డు నంబర్', 'c.name': 'మీ పేరు', 'c.phone': 'ఫోన్ (ఐచ్ఛికం)',
  'c.submit': 'సమర్పించండి', 'c.ticket': 'మీ టికెట్:', 'c.keep': 'స్థితి తెలుసుకోవడానికి దీన్ని భద్రపరచండి.', 'c.track': 'టికెట్ ట్రాక్ చేయండి', 'c.trackbtn': 'ట్రాక్', 'c.none': 'టికెట్ కనబడలేదు.', 'c.recent': 'ఇటీవలి ఫిర్యాదులు', 'w': 'వార్డు',
  'cat.Road': 'రోడ్డు', 'cat.Water': 'నీరు', 'cat.Drain': 'కాలువ', 'cat.Streetlight': 'వీధి దీపం', 'cat.Garbage': 'చెత్త', 'cat.Other': 'ఇతర',
  'cat.Gram Sabha': 'గ్రామ సభ', 'cat.Tax': 'పన్ను', 'cat.Tender': 'టెండర్',
  'st.RECEIVED': 'అందింది', 'st.IN_PROGRESS': 'జరుగుతోంది', 'st.RESOLVED': 'పరిష్కరించబడింది',
  'f.text': '© 2026 గుమ్మిర్యాల్ గ్రామ పంచాయతీ · అత్యవసరం: అంబులెన్స్ 108 · పోలీసు 100',
  'a.login': 'అడ్మిన్ లాగిన్', 'a.user': 'వినియోగదారు పేరు', 'a.pass': 'పాస్‌వర్డ్', 'a.signin': 'లాగిన్', 'a.bad': 'వినియోగదారు పేరు లేదా పాస్‌వర్డ్ తప్పు.', 'a.panel': 'అడ్మిన్ ప్యానెల్',
  'a.logout': 'లాగ్ అవుట్', 'a.complaints': 'ఫిర్యాదులు', 'a.notices': 'నోటీసులు', 'a.account': 'ఖాతా', 'a.delete': 'తొలగించు', 'a.confirm': 'దీన్ని తొలగించాలా?', 'a.save': 'సేవ్',
  'a.edit': 'సవరించు', 'a.new': 'కొత్త / సవరణ నోటీసు', 'a.titleEn': 'శీర్షిక (ఇంగ్లీష్)', 'a.titleTe': 'శీర్షిక (తెలుగు)', 'a.bodyEn': 'వివరాలు (ఇంగ్లీష్)', 'a.bodyTe': 'వివరాలు (తెలుగు)',
  'a.cat': 'వర్గం', 'a.date': 'తేదీ', 'a.newpass': 'కొత్త పాస్‌వర్డ్ (కనీసం 8 అక్షరాలు)', 'a.changed': 'పాస్‌వర్డ్ మార్చబడింది. దయచేసి మళ్లీ లాగిన్ చేయండి.', 'a.reporter': 'నివేదించినవారు',
  'a.error': 'ఏదో పొరపాటు జరిగింది.', 'a.te': 'వివరణ తెలుగు అనువాదం'
};

@Injectable({ providedIn: 'root' })
export class LangService {
  lang = signal<'en' | 'te'>((localStorage.getItem('lang') as 'en' | 'te') || 'en');
  set(l: 'en' | 'te') { this.lang.set(l); localStorage.setItem('lang', l); document.documentElement.lang = l; }
  t(k: string): string { return (this.lang() === 'te' ? TE[k] : EN[k]) ?? EN[k] ?? k; }
  /** For user-entered data that has no translation (e.g. a custom category): shows it as typed. */
  cat(c: string): string { const v = this.t('cat.' + c); return v === 'cat.' + c ? c : v; }
  pick(en?: string, te?: string): string { return this.lang() === 'te' && te ? te : en ?? ''; }
}
