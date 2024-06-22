import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  register(username: string, password: string): boolean {
    const userExists = !!localStorage.getItem(username);
    if (!userExists) {
      const user = { username, password };
      localStorage.setItem(username, JSON.stringify(user));
      return true;
    } else {
      return false;
    }
  }

  login(username: string, password: string): boolean {
    const storedUser = JSON.parse(localStorage.getItem(username) || '{}');
    if (storedUser && storedUser.password === password) {
      localStorage.setItem('currentUser', JSON.stringify({ username }));
      return true;
    } else {
      return false;
    }
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUser(): any {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
  }
}
