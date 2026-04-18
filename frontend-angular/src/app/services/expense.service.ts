import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense, SummaryItem, PredictionResponse, Anomaly } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  getExpenses() {
    return this.http.get<Expense[]>(`${this.baseUrl}/expenses`);
  }

  addExpense(expense: Expense) {
    return this.http.post<Expense>(`${this.baseUrl}/expenses`, expense);
  }

  updateExpense(id: number, expense: Expense) {
    return this.http.put<Expense>(`${this.baseUrl}/expenses/${id}`, expense);
  }

  deleteExpense(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/expenses/${id}`);
  }

  getWeeklySummary() {
    return this.http.get<SummaryItem[]>(`${this.baseUrl}/analytics/weekly`);
  }

  getMonthlySummary() {
    return this.http.get<SummaryItem[]>(`${this.baseUrl}/analytics/monthly`);
  }

  getCategorySummary() {
    return this.http.get<SummaryItem[]>(`${this.baseUrl}/analytics/category`);
  }

  getAnomalies() {
    return this.http.get<Anomaly[]>(`${this.baseUrl}/analytics/anomalies`);
  }

  getNextMonthPrediction() {
    return this.http.get<PredictionResponse>(`${this.baseUrl}/ai/predict-next-month`);
  }
}
