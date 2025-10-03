import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private apiUrl = `${environment.apiBaseUrl}/Transactions`;

    constructor(private http: HttpClient) {}


    GetTransactions(): Observable<Transaction[]> {
      return this.http.get<{ items: Transaction[] }>(this.apiUrl).pipe(
        map(response => response.items)
      );
    }

    GetTransaction(id: number): Observable<Transaction> {
        return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
    }

    CreateTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>(this.apiUrl, transaction);
    }

    UpdateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
    }

    DeleteTransaction(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
