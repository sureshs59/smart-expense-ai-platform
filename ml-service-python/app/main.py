from datetime import datetime
from statistics import mean
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Expense AI ML Service")


class Expense(BaseModel):
    id: Optional[int] = None
    title: str
    amount: float
    category: str
    expenseDate: str
    notes: Optional[str] = None


class ExpensePayload(BaseModel):
    expenses: List[Expense]


@app.get("/")
def root():
    return {"message": "Expense AI ML service is running"}


@app.post("/predict/next-month")
def predict_next_month(payload: ExpensePayload):
    expenses = payload.expenses
    if not expenses:
        return {"predictedExpense": 0.0, "message": "No historical data available."}

    monthly_totals = {}
    for expense in expenses:
        date_obj = datetime.strptime(expense.expenseDate, "%Y-%m-%d")
        key = f"{date_obj.year}-{date_obj.month:02d}"
        monthly_totals[key] = monthly_totals.get(key, 0.0) + expense.amount

    totals = list(monthly_totals.values())
    predicted = round(mean(totals) * 1.05, 2)

    return {
        "predictedExpense": predicted,
        "message": "Prediction based on average historical monthly spend with a 5% trend factor."
    }


@app.post("/detect/anomalies")
def detect_anomalies(payload: ExpensePayload):
    expenses = payload.expenses
    if not expenses:
        return {"anomalies": []}

    avg = mean([e.amount for e in expenses])
    threshold = avg * 2
    anomalies = [
        {
            "id": e.id,
            "title": e.title,
            "amount": e.amount,
            "category": e.category,
            "expenseDate": e.expenseDate,
            "message": "Expense is significantly above average"
        }
        for e in expenses if e.amount >= threshold
    ]
    return {"anomalies": anomalies}
