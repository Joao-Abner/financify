import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionService } from './transaction.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],                                                                                                                                                                                                                                                                                                                                                                                    
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent implements OnInit{
  transactionForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      type: ['income', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      date: ['', [Validators.required, this.dateValidator]],
      description: ['', Validators.required]
    });
  }

  dateValidator(control: any): { [key: string]: any } | null {
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!datePattern.test(control.value)) {
      return { invalidDate: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const transaction: Transaction = {
        ...formValue,
        date: this.convertDateToISO(formValue.date) // Converte a data para o formato ISO
      };
      this.transactionService.addTransaction(transaction).subscribe(() => {
        this.router.navigate(['/']);
      });
    } else {
      // Exibe mensagens de erro caso o formulário não seja válido
      Object.keys(this.transactionForm.controls).forEach(key => {
        this.transactionForm.controls[key].markAsDirty();
      });
    }
  }

  private convertDateToISO(date: string): string {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }
}
