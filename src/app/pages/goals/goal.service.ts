import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Goal {
  id?: number;
  description: string;
  amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getGoals(userId: number): Observable<Goal[]> {
    const url = `${this.baseUrl}/${userId}/goals`;
    return this.http.get<Goal[]>(url);
  }

  addGoal(userId: number, goal: Goal): Observable<Goal> {
    const url = `${this.baseUrl}/${userId}/goals`;    
    return this.http.post<Goal>(url, goal);
  }

  deleteGoal(userId: number, goalId: number): Observable<void> {
    const url = `${this.baseUrl}/${userId}/goals/${goalId}`;
    return this.http.delete<void>(url);
  }
}
