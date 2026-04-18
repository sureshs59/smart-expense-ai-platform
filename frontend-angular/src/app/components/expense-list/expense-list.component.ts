import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="card">
      <div class="header">
        <h2>Expense History</h2>
        <span class="small">{{ expenses.length }} records</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let expense of expenses">
            <td>{{ expense.title }}</td>
            <td>{{ expense.category }}</td>
            <td>{{ expense.amount | currency }}</td>
            <td>{{ expense.expenseDate | date }}</td>
            <td>{{ expense.notes || '-' }}</td>
            <td style="display:flex; gap:8px;">
              <button class="secondary" (click)="edit.emit(expense)">Edit</button>
              <button class="warn" (click)="remove.emit(expense.id!)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ExpenseListComponent {
  @Input() expenses: Expense[] = [];
  @Output() edit = new EventEmitter<Expense>();
  @Output() remove = new EventEmitter<number>();
}
