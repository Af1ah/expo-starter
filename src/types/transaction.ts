
export type TransactionType = 'income' | 'expense';

export type CategoryType = 'food' | 'transport' | 'bills' | 'shopping' | 'entertainment' | 'health' | 'housing' |'income' | 'other';

export interface Transaction {
  id: string;
  amount: number;
  title: string;
  category: CategoryType;
  type: TransactionType;
  date: string;
  time: string;
  note?: string;
}

export interface TransactionFilter {
  id: string;
  label: string;
  type?: TransactionType;
  category?: CategoryType;
}