import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collection } from '../types/collection.type';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  apiUrl: string;
  userId: number | null;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = 'http://localhost:3000';
    this.userId = this.authService.getUserId();
  }

  getCollections(): Observable<Collection[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<Collection[]>(
      `${this.apiUrl}/collections/user/${this.userId}`,
      {
        headers,
      }
    );
  }

  addCollection(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/collection/user/${this.userId}`,
      data,
      {
        headers,
      }
    );
  }

  updateCollection(id: number, data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/collection/${id}`, data, {
      headers,
    });
  }

  getCollection(id: number): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.get<Collection>(`${this.apiUrl}/collection/${id}`, {
      headers,
    });
  }

  deleteCollection(id: number): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete<any>(`${this.apiUrl}/collection/${id}`, {
      headers,
    });
  }
}
