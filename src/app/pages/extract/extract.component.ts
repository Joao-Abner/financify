import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionService } from '../transactions/transaction.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-extract',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extract.component.html',
  styleUrl: './extract.component.css'
})
export class ExtractComponent implements OnInit{
  transactions: Transaction[] = [];
  selectedMonth: number;
  selectedYear: number;
  months = [
    { name: 'Janeiro', value: 1 },
    { name: 'Fevereiro', value: 2 },
    { name: 'Março', value: 3 },
    { name: 'Abril', value: 4 },
    { name: 'Maio', value: 5 },
    { name: 'Junho', value: 6 },
    { name: 'Julho', value: 7 },
    { name: 'Agosto', value: 8 },
    { name: 'Setembro', value: 9 },
    { name: 'Outubro', value: 10 },
    { name: 'Novembro', value: 11 },
    { name: 'Dezembro', value: 12 }
  ];
  years: number[] = [];

  constructor(
    private transactionService: TransactionService
  ) {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear - 1, currentYear, currentYear + 1]; // Exemplo de anos disponíveis
    this.selectedMonth = new Date().getMonth() + 1; // Mês atual (1 a 12)
    this.selectedYear = currentYear;
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getTransactionsByMonthYear(this.selectedMonth, this.selectedYear).subscribe(transactions => {
      this.transactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 == this.selectedMonth && transactionDate.getFullYear() == this.selectedYear;
      });
    });
  }

  onDeleteTransaction(transaction: Transaction): void {
    if (transaction.id !== undefined) {
      this.transactionService.deleteTransaction(transaction.id).subscribe(() => {
        console.log('Transação excluída com sucesso!');
        this.loadTransactions();
      });
    }
  }


}
