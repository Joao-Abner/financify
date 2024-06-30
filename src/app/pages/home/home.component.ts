import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Transaction, TransactionService } from '../transactions/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalIncome$: Observable<number>;
  totalExpense$: Observable<number>;
  balance$: Observable<number>;
  recentTransactions$: Observable<Transaction[]>;
  userId: number | null;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private route: ActivatedRoute
  ) {
    this.totalIncome$ = new Observable<number>();
    this.totalExpense$ = new Observable<number>();
    this.balance$ = new Observable<number>();
    this.recentTransactions$ = new Observable<Transaction[]>();
    this.userId = this.authService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.onRouteActivated();
    });
  }

  onRouteActivated(): void {
    this.userId = this.authService.getCurrentUserId(); // Atualiza userId caso tenha mudado

    if (this.userId !== null) {
      this.loadTransactions();
      this.balance$ = this.transactionService.getBalance(this.userId);

    } else {
      console.error('Usuário não está logado.');
      // Tratar o erro de usuário não logado
    }
  }

  loadTransactions(): void {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    this.totalIncome$ = this.transactionService.getTransactions(this.userId!).pipe(
      map(transactions => transactions
        .filter(transaction => transaction.type === 'income' &&
          new Date(transaction.date).getMonth() + 1 === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear)
        .reduce((sum, transaction) => sum + transaction.amount, 0)
      )
    );

    this.totalExpense$ = this.transactionService.getTransactions(this.userId!).pipe(
      map(transactions => transactions
        .filter(transaction => transaction.type === 'expense' &&
          new Date(transaction.date).getMonth() + 1 === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear)
        .reduce((sum, transaction) => sum + transaction.amount, 0)
      )
    );

    this.recentTransactions$ = this.transactionService.getTransactions(this.userId!).pipe(
      map(transactions => transactions
        .filter(transaction => new Date(transaction.date).getMonth() + 1 === currentMonth &&
          new Date(transaction.date).getFullYear() === currentYear)
        .slice(-3)
      )
    );
  }
}
