import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private api = '/api';   // relative: works locally (via proxy) and when hosted

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.api}/login`, { email, password })
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }

  getProfile() {
    return this.http.get<any>(`${this.api}/profile`);
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      return JSON.parse(atob(token.split('.')[1])).exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}