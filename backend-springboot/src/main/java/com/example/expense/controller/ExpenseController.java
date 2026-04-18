package com.example.expense.controller;

import com.example.expense.dto.AnomalyDto;
import com.example.expense.dto.PredictionResponse;
import com.example.expense.dto.SummaryDto;
import com.example.expense.entity.Expense;
import com.example.expense.service.AiClientService;
import com.example.expense.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final AiClientService aiClientService;

    @GetMapping("/expenses")
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @PostMapping("/expenses")
    @ResponseStatus(HttpStatus.CREATED)
    public Expense addExpense(@Valid @RequestBody Expense expense) {
        return expenseService.saveExpense(expense);
    }

    @PutMapping("/expenses/{id}")
    public Expense updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expense) {
        return expenseService.updateExpense(id, expense);
    }

    @DeleteMapping("/expenses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }

    @GetMapping("/analytics/weekly")
    public List<SummaryDto> weeklySummary() {
        return expenseService.getWeeklySummary();
    }

    @GetMapping("/analytics/monthly")
    public List<SummaryDto> monthlySummary() {
        return expenseService.getMonthlySummary();
    }

    @GetMapping("/analytics/category")
    public List<SummaryDto> categorySummary() {
        return expenseService.getCategorySummary();
    }

    @GetMapping("/analytics/anomalies")
    public List<AnomalyDto> anomalies() {
        return expenseService.detectSimpleAnomalies();
    }

    @GetMapping("/ai/predict-next-month")
    public PredictionResponse predictNextMonth() {
        return aiClientService.predictNextMonth(expenseService.getAllForMl());
    }
}
