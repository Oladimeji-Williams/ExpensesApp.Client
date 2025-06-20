import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiBaseUrl}/Auth`;
    private currentUserSubject = new BehaviorSubject<string | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        const token = localStorage.getItem('token');
        if (token) {
            this.currentUserSubject.next('user');
        }
    }

    login(credentials: User): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next('user');
            })
        );
    }

    register(details: User): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Register`, details).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next('user');
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}
