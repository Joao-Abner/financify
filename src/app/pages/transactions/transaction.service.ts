import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Transaction {
  id?: number;
  type: "income" | "expense";
  amount: number;
  date: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:3000/users';

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Implementar carregamento inicial de dados, se necessário
  }

  getTransactions(userId: number): Observable<Transaction[]> {
    const url = `${this.baseUrl}/${userId}/transactions`;
    return this.http.get<Transaction[]>(url).pipe(
      tap(transactions => this.transactionsSubject.next(transactions))
    );
  }

  addTransaction(userId: number, transaction: Transaction): Observable<Transaction> {
    const url = `${this.baseUrl}/${userId}/transactions`;
    return this.http.post<Transaction>(url, transaction).pipe(
      tap(newTransaction => {
        const currentTransactions = this.transactionsSubject.getValue();
        this.transactionsSubject.next([...currentTransactions, newTransaction]);
      })
    );
  }

  deleteTransaction(userId: number, transactionId: number): Observable<void> {
    const url = `${this.baseUrl}/${userId}/transactions/${transactionId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        const updatedTransactions = this.transactionsSubject.getValue().filter(t => t.id !== transactionId);
        this.transactionsSubject.next(updatedTransactions);
      })
    );
  }

  clearDataOnLogout(): void {
    this.transactionsSubject.next([]);
  }

  getTransactionsByType(userId: number, type: 'income' | 'expense'): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => transactions.filter(transaction => transaction.type === type))
    );
  }

  getTransactionsByMonthYear(userId: number, month: number, year: number): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getUTCMonth() + 1 === month && transactionDate.getFullYear() === year;
      }))
    );
  }

  getBalance(userId: number): Observable<number> {
    const url = `${this.baseUrl}/${userId}/saldo`;
    return this.http.get<number>(url);
  }

  updateTransaction(userId: number, transaction: Transaction): Observable<Transaction> {
    const url = `${this.baseUrl}/${userId}/transactions/${transaction.id}`;
    return this.http.put<Transaction>(url, transaction).pipe(
      tap(updatedTransaction => {
        const currentTransactions = this.transactionsSubject.getValue();
        const index = currentTransactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
          currentTransactions[index] = updatedTransaction;
          this.transactionsSubject.next(currentTransactions);
        }
      })
    );
  }
  
}
