import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'http://localhost:3000';
  }

  createUser(userdata: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register`, userdata);
  }

  getUser(): Observable<User> {
    const userId = this.getUserId();
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  updateUser(userdata: object): Observable<any> {
    const userId = this.getUserId();
    const headers = this.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/user/${userId}`, userdata, {
      headers,
    });
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
