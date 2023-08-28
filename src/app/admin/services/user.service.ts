import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user.types';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string;
  userId: number | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = 'http://localhost:3000';
    this.userId = this.authService.getUserId();
  }

  createUser(userdata: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register`, userdata);
  }

  getUser(): Observable<User> {
    const headers = this.authService.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/user/${this.userId}`, {
      headers,
    });
  }

  updateUser(userdata: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/user/${this.userId}`, userdata, {
      headers,
    });
  }
}
