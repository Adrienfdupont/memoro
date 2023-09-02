import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Card } from '../types/card.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  apiUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = 'http://localhost:3000';
  }

  getCards(collectionId: number): Observable<Card[]> {
    const headers = this.authService.getHeaders();
    return this.http.get<Card[]>(
      `${this.apiUrl}/cards/collection/${collectionId}`,
      { headers }
    );
  }

  addCard(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/card`, data, { headers });
  }

  updateCard(data: any): Observable<any> {
    const headers = this.authService.getHeaders();
    return this.http.put<any>(`${this.apiUrl}/card`, data, { headers });
  }
}
