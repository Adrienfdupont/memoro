import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Card } from '../types/card.type';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCards(collectionId: number): Observable<Card[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<Card[]>(
      `${environment.apiUrl}/cards/collection/${collectionId}`,
      { headers }
    );
  }

  addCard(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(`${environment.apiUrl}/card`, data, { headers });
  }

  updateCard(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${environment.apiUrl}/card`, data, { headers });
  }

  deleteCard(id: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.delete<any>(`${environment.apiUrl}/card/${id}`, {
      headers,
    });
  }
}
