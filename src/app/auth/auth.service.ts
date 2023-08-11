import { HttpClient } from '@angular/common/http';
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

  getToken(userdata: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, userdata);
  }

  register(userdata: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user`, userdata);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigateByUrl('login');
  }
}
