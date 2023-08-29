import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  urlAfterLogin: string;
  apiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.urlAfterLogin = 'account';
    this.apiUrl = 'http://localhost:3000';
  }

  login(userdata: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, userdata);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigateByUrl('login');
  }

  getUserId(): number | null {
    let userId: string | null;
    userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
