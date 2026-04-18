import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="header">
        <h2>{{ editing ? 'Edit Expense' : 'Add Expense' }}</h2>
        <span class="badge">{{ editing ? 'Update mode' : 'Create mode' }}</span>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()" class="grid grid-2">
        <div>
          <label>Title</label>
          <input formControlName="title" placeholder="Groceries" />
        </div>

        <div>
          <label>Amount</label>
          <input type="number" step="0.01" formControlName="amount" />
        </div>

        <div>
          <label>Category</label>
          <select formControlName="category">
            <option value="">Select category</option>
            <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
          </select>
        </div>

        <div>
          <label>Date</label>
          <input type="date" formControlName="expenseDate" />
        </div>

        <div style="grid-column: 1 / -1;">
          <label>Notes</label>
          <textarea rows="3" formControlName="notes"></textarea>
        </div>

        <div style="grid-column: 1 / -1; display:flex; gap:10px;">
          <button class="primary" type="submit" [disabled]="form.invalid">{{ editing ? 'Update' : 'Save' }}</button>
          <button class="secondary" type="button" (click)="reset()">Clear</button>
        </div>
      </form>
    </div>
  `
})
export class ExpenseFormComponent implements OnChanges {
  @Input() editingExpense: Expense | null = null;
  @Output() saveExpense = new EventEmitter<Expense>();
  @Output() cancelEdit = new EventEmitter<void>();

  categories = ['Food', 'Groceries', 'Transport', 'Housing', 'Utilities', 'Health', 'Shopping', 'Other'];
  editing = false;

  form = new FormBuilder().group({
    title: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    expenseDate: ['', Validators.required],
    notes: ['']
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingExpense']) {
      if (this.editingExpense) {
        this.editing = true;
        this.form.patchValue(this.editingExpense);
      } else {
        this.editing = false;
        this.reset(false);
      }
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue() as Expense;
    if (this.editingExpense?.id) value.id = this.editingExpense.id;
    this.saveExpense.emit(value);
    this.reset(false);
  }

  reset(emitCancel = true): void {
    this.form.reset({ title: '', amount: 0, category: '', expenseDate: '', notes: '' });
    this.editing = false;
    if (emitCancel) this.cancelEdit.emit();
  }
}
