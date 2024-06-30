import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUser: { id: number, username: string } | null = null;
  public authChangeEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      map(response => {
        if (response.username && response.id) {
          this.currentUser = { id: response.id, username: response.username };
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.authChangeEvent.emit();
          return true;
        } else {
          return false;
        }
      })
    );
  }

  register(username: string, password: string): Observable<boolean> {
    const newUser = { username, password, saldo: { total: 0 }, transactions: [] };

    return this.http.post<any>(this.apiUrl, newUser).pipe(
      map(user => !!user)
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.authChangeEvent.emit();
  }

  getCurrentUser(): { id: number, username: string } | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    }
    return this.currentUser;
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }
}
