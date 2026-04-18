export interface Expense {
  id?: number;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  notes?: string;
}

export interface SummaryItem {
  label: string;
  total: number;
}

export interface PredictionResponse {
  predictedExpense: number;
  message: string;
}

export interface Anomaly {
  id: number;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  message: string;
}
