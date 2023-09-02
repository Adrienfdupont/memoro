import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user.types';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = 'http://localhost:3000';
  }

  createUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/register`, data);
  }

  getUser(userId: number): Observable<User> {
    const headers = this.authService.getHeaders();
    return this.http.get<User>(`${this.apiUrl}/user/${userId}`, {
      headers,
    });
  }

  updateUser(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/user`, data, {
      headers,
    });
  }

  deleteUser(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/user/delete`, data, {
      headers,
    });
  }
}
