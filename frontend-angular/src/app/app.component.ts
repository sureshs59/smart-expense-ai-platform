import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Expense, SummaryItem, PredictionResponse, Anomaly } from './models/expense.model';
import { ExpenseService } from './services/expense.service';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ExpenseFormComponent, ExpenseListComponent, DashboardComponent],
  template: `
    <div class="container">
      <div class="header" style="margin-bottom: 20px;">
        <div>
          <h1>Smart Expense AI Platform</h1>
          <div class="small">Track expenses, visualize trends, and predict next month spending.</div>
        </div>
      </div>

      <div class="grid grid-2">
        <app-expense-form
          [editingExpense]="editingExpense"
          (saveExpense)="onSave($event)"
          (cancelEdit)="editingExpense = null">
        </app-expense-form>

        <app-dashboard
          [weeklySummary]="weeklySummary"
          [monthlySummary]="monthlySummary"
          [categorySummary]="categorySummary"
          [prediction]="prediction"
          [anomalies]="anomalies">
        </app-dashboard>
      </div>

      <div style="margin-top: 20px;">
        <app-expense-list
          [expenses]="expenses"
          (edit)="editingExpense = $event"
          (remove)="onDelete($event)">
        </app-expense-list>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  private readonly expenseService = inject(ExpenseService);

  expenses: Expense[] = [];
  weeklySummary: SummaryItem[] = [];
  monthlySummary: SummaryItem[] = [];
  categorySummary: SummaryItem[] = [];
  prediction: PredictionResponse | null = null;
  anomalies: Anomaly[] = [];
  editingExpense: Expense | null = null;

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    forkJoin({
      expenses: this.expenseService.getExpenses(),
      weekly: this.expenseService.getWeeklySummary(),
      monthly: this.expenseService.getMonthlySummary(),
      category: this.expenseService.getCategorySummary(),
      prediction: this.expenseService.getNextMonthPrediction(),
      anomalies: this.expenseService.getAnomalies()
    }).subscribe(({ expenses, weekly, monthly, category, prediction, anomalies }) => {
      this.expenses = expenses;
      this.weeklySummary = weekly;
      this.monthlySummary = monthly;
      this.categorySummary = category;
      this.prediction = prediction;
      this.anomalies = anomalies;
    });
  }

  onSave(expense: Expense): void {
    const request$ = expense.id
      ? this.expenseService.updateExpense(expense.id, expense)
      : this.expenseService.addExpense(expense);

    request$.subscribe(() => {
      this.editingExpense = null;
      this.loadAll();
    });
  }

  onDelete(id: number): void {
    this.expenseService.deleteExpense(id).subscribe(() => this.loadAll());
  }
}
