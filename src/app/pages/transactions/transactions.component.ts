import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionService, Transaction } from './transaction.service';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactionForm!: FormGroup;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      type: ['income', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      date: ['', [Validators.required, this.dateValidator]],
      description: ['', Validators.required]
    });

    this.userId = this.authService.getCurrentUserId();
    if (!this.userId) {
      console.error('UserId não encontrado. Usuário não autenticado?');
      // Tratar o erro conforme necessário, redirecionar para página de login, etc.
    }
  }

  dateValidator(control: any): { [key: string]: any } | null {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(control.value)) {
      return { invalidDate: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.transactionForm.valid && this.userId) {
      const formValue = this.transactionForm.value;
      const transaction: Transaction = {
        ...formValue,
        date: this.convertDateToISO(formValue.date)
      };
      this.transactionService.addTransaction(this.userId, transaction).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      Object.keys(this.transactionForm.controls).forEach(key => {
        this.transactionForm.controls[key].markAsDirty();
      });
    }
  }

  private convertDateToISO(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }

  getTransactionsByMonthYear(month: number, year: number): Observable<Transaction[]> {
    if (this.userId) {
      return this.transactionService.getTransactionsByMonthYear(this.userId, month, year);
    } else {
      console.error('UserId não encontrado. Não é possível buscar transações.');
      return new Observable<Transaction[]>(); // Retornar um observable vazio ou tratar o erro conforme necessário
    }
  }
}
