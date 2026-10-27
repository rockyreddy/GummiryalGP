import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Complaint {
  id?: number; ticketNo?: string; category: string;
  description: string; descriptionTe?: string; ward: number;
  name?: string; phone?: string; status?: string; createdAt?: string;
}
export interface Notice {
  id?: number; category: string; titleEn: string;
  titleTe: string; bodyEn: string; bodyTe: string; date: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  // Public
  complaints = () => this.http.get<Complaint[]>('/api/complaints');
  track = (t: string) => this.http.get<Complaint>(`/api/complaints/${t}`);
  create = (c: Complaint) => this.http.post<Complaint>('/api/complaints', c);
  notices = () => this.http.get<Notice[]>('/api/notices');
  stats = () => this.http.get<{ total: number; resolved: number; notices: number }>('/api/stats');
  // Admin (Authorization header is added by the interceptor)
  adminComplaints = () => this.http.get<Complaint[]>('/api/admin/complaints');
  setStatus = (id: number, status: string) => this.http.put<Complaint>(`/api/admin/complaints/${id}/status`, { status });
  setTranslation = (id: number, descriptionTe: string) => this.http.put<Complaint>(`/api/admin/complaints/${id}/translation`, { descriptionTe });
  delComplaint = (id: number) => this.http.delete(`/api/admin/complaints/${id}`);
  saveNotice = (n: Notice) => n.id ? this.http.put<Notice>(`/api/admin/notices/${n.id}`, n) : this.http.post<Notice>('/api/admin/notices', n);
  delNotice = (id: number) => this.http.delete(`/api/admin/notices/${id}`);
  changePassword = (newPassword: string) => this.http.post('/api/admin/password', { newPassword });
}
