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

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = 'http://localhost:3000';
  }

  getCollections(userId: number): Observable<Collection[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<Collection[]>(
      `${this.apiUrl}/collections/user/${userId}`,
      {
        headers,
      }
    );
  }

  addCollection(userId: number, data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/collection/user/${userId}`,
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

  getCollection(id: number): Observable<Collection> {
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
