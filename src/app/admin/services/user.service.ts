import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../types/user.types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = 'http://localhost:3000';
  }

  createUser(userdata: object): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user`, userdata);
  }

  getUser(userId: number): Observable<User> {
    const headers = this.authService.getHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers });
  }
}
