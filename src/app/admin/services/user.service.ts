import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user.types';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  createUser(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/register`, data);
  }

  getUser(userId: number): Observable<User> {
    const headers = this.authService.getHeaders();
    return this.http.get<User>(`${environment.apiUrl}/user/${userId}`, {
      headers,
    });
  }

  updateUser(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${environment.apiUrl}/user`, data, {
      headers,
    });
  }

  deleteUser(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(`${environment.apiUrl}/user/delete`, data, {
      headers,
    });
  }
}
