import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionService } from '../transactions/transaction.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  totalIncome$: Observable<number> = new Observable<number>();
  totalExpense$: Observable<number> = new Observable<number>();
  balance$: Observable<number> = new Observable<number>();
  recentTransactions$: Observable<Transaction[]> = new Observable<Transaction[]>();

  constructor(private transactionService: TransactionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.onRouteActivated();
    });
  }

  onRouteActivated(): void {
    this.loadTransactions();
    this.balance$ = this.transactionService.balance$;
  }

  loadTransactions(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    console.log(currentMonth);

    this.totalIncome$ = this.transactionService.transactions$.pipe(
      map(transactions => transactions
        .filter(transaction => transaction.type === 'income' &&
          new Date(transaction.date).getMonth() == currentMonth &&
          new Date(transaction.date).getFullYear() == currentYear)
        .reduce((sum, transaction) => sum + transaction.amount, 0)
      )
    );

    this.totalExpense$ = this.transactionService.transactions$.pipe(
      map(transactions => transactions
        .filter(transaction => transaction.type === 'expense' &&
          new Date(transaction.date).getMonth() == currentMonth &&
          new Date(transaction.date).getFullYear() == currentYear)
        .reduce((sum, transaction) => sum + transaction.amount, 0)
      )
    );

    this.recentTransactions$ = this.transactionService.transactions$.pipe(
      map(transactions => transactions
        .filter(transaction =>
          new Date(transaction.date).getMonth() == currentMonth &&
          new Date(transaction.date).getFullYear() == currentYear)
        .slice(-3)
      )
    );
  }
}
