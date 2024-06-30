import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Transaction, TransactionService } from '../transactions/transaction.service';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

@Component({
  selector: 'app-extract',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extract.component.html',
  styleUrls: ['./extract.component.css']
})
export class ExtractComponent implements OnInit {
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
  userId: number | null;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService
  ) {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear - 1, currentYear, currentYear + 1];
    this.selectedMonth = new Date().getMonth() + 1;
    this.selectedYear = currentYear;
    this.userId = this.authService.getCurrentUserId();
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    if (this.userId) {
      this.transactionService.getTransactions(this.userId).subscribe({
        next: (transactions: Transaction[]) => {
          this.transactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getUTCMonth() + 1 === this.selectedMonth && transactionDate.getFullYear() === this.selectedYear;
          });
        },
        error: (error) => {
          console.error('Erro ao obter transações:', error);
        }
      });
    } else {
      console.error('Usuário não está logado.');
    }
  }

  onDeleteTransaction(transaction: Transaction): void {
    if (transaction.id !== undefined && this.userId) {
      this.transactionService.deleteTransaction(this.userId, transaction.id).subscribe({
        next: () => {
          console.log('Transação excluída com sucesso!');
          this.loadTransactions();
        },
        error: (error) => {
          console.error('Erro ao excluir transação:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Ajuste de fuso horário local
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  }

  getTransactionType(type: string): string {
    return type === 'income' ? 'Receita' : 'Despesa';
  }
}
