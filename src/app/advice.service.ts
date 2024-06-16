import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdviceService {
  private apiUrl = 'https://api.chucknorris.io/jokes/random';

  constructor(private http: HttpClient) { }

  getAdvice(): Observable<string> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => response.value)
    );
  }

  getMultipleAdvices(count: number): Observable<string[]> {
    const requests: Observable<string>[] = [];
    for (let i = 0; i < count; i++) {
      requests.push(this.getAdvice());
    }
    return forkJoin(requests);
  }
}
