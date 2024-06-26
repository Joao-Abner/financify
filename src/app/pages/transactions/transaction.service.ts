import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/transactions';
  private balanceUrl = 'http://localhost:3000/saldo';

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  private balanceSubject = new BehaviorSubject<number>(0);

  transactions$ = this.transactionsSubject.asObservable();
  balance$ = this.balanceSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getTransactions().subscribe(transactions => this.transactionsSubject.next(transactions));
    this.getBalance().subscribe(balance => this.balanceSubject.next(balance));
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction).pipe(
      tap(newTransaction => {
        this.transactionsSubject.next([...this.transactionsSubject.getValue(), newTransaction]);
        this.updateBalance(newTransaction);
      })
    );
  }

  getBalance(): Observable<number> {
    return this.http.get<any>(this.balanceUrl).pipe(
      map((saldo: any) => saldo.total as number)
    );
  }

  private updateBalance(transaction: Transaction, isDeletion = false): void {
    const currentBalance = this.balanceSubject.getValue();
    const balanceUpdate = transaction.type === 'income' ? transaction.amount : -transaction.amount;
    const newBalance = isDeletion ? currentBalance - balanceUpdate : currentBalance + balanceUpdate;

    this.balanceSubject.next(newBalance);
    this.http.put<number>(this.balanceUrl, { total: newBalance }).subscribe();
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      switchMap(() => {
        const currentTransactions = this.transactionsSubject.getValue();
        const transactionToDelete = currentTransactions.find(transaction => transaction.id === id);
        if (transactionToDelete) {
          const updatedTransactions = currentTransactions.filter(transaction => transaction.id !== id);
          this.transactionsSubject.next(updatedTransactions);
          this.updateBalance(transactionToDelete, true);
        }
        return this.http.get<void>(this.balanceUrl);
      })
    );
  }

  getTransactionsByMonthYear(month: number, year: number): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map(transactions => transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getUTCMonth() + 1 == month && transactionDate.getFullYear() == year;
      }))
    );
  }
}
