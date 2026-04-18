import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, registerables, Chart } from 'chart.js';
import { Anomaly, PredictionResponse, SummaryItem } from '../../models/expense.model';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, CurrencyPipe, DatePipe],
  template: `
    <div class="grid grid-2">
      <div class="card">
        <h3>Weekly Expenses</h3>
        <canvas baseChart [data]="weeklyData" [type]="barType"></canvas>
      </div>

      <div class="card">
        <h3>Monthly Expenses</h3>
        <canvas baseChart [data]="monthlyData" [type]="lineType"></canvas>
      </div>

      <div class="card">
        <h3>Category Breakdown</h3>
        <canvas baseChart [data]="categoryData" [type]="pieType"></canvas>
      </div>

      <div class="card">
        <h3>Next Month Prediction</h3>
        <div class="stat">{{ prediction?.predictedExpense || 0 | currency }}</div>
        <p class="small">{{ prediction?.message }}</p>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <div class="header">
        <h3>Anomalies</h3>
        <span class="small">{{ anomalies.length }} flagged</span>
      </div>
      <div *ngIf="anomalies.length === 0" class="small">No unusual spending detected.</div>
      <ul *ngIf="anomalies.length > 0">
        <li *ngFor="let anomaly of anomalies">
          <strong>{{ anomaly.title }}</strong> — {{ anomaly.amount | currency }} on {{ anomaly.expenseDate | date }} ({{ anomaly.category }})
        </li>
      </ul>
    </div>
  `
})
export class DashboardComponent {
  @Input() set weeklySummary(value: SummaryItem[]) {
    this.weeklyData = {
      labels: value.map(v => v.label),
      datasets: [{ data: value.map(v => v.total), label: 'Weekly Total' }]
    };
  }

  @Input() set monthlySummary(value: SummaryItem[]) {
    this.monthlyData = {
      labels: value.map(v => v.label),
      datasets: [{ data: value.map(v => v.total), label: 'Monthly Total' }]
    };
  }

  @Input() set categorySummary(value: SummaryItem[]) {
    this.categoryData = {
      labels: value.map(v => v.label),
      datasets: [{ data: value.map(v => v.total) }]
    };
  }

  @Input() prediction: PredictionResponse | null = null;
  @Input() anomalies: Anomaly[] = [];

  barType: ChartType = 'bar';
  lineType: ChartType = 'line';
  pieType: ChartType = 'pie';

  weeklyData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [{ data: [] }] };
  monthlyData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [{ data: [] }] };
  categoryData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [{ data: [] }] };
}
