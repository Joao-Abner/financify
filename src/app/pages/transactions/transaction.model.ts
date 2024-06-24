export interface Transaction {
  id?: number;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  description: string;
}