import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Collection } from '../types/collection.type';
import { AuthService } from 'src/app/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCollections(userId: number): Observable<Collection[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<Collection[]>(
      `${environment.apiUrl}/collection/user/${userId}`,
      {
        headers,
      }
    );
  }

  addCollection(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(`${environment.apiUrl}/collection`, data, {
      headers,
    });
  }

  updateCollection(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${environment.apiUrl}/collection`, data, {
      headers,
    });
  }

  getCollection(id: number): Observable<Collection> {
    const headers = this.authService.getHeaders();
    return this.http.get<Collection>(`${environment.apiUrl}/collection/${id}`, {
      headers,
    });
  }

  deleteCollection(id: number): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete<any>(`${environment.apiUrl}/collection/${id}`, {
      headers,
    });
  }
}
