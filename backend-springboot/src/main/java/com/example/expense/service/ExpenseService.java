package com.example.expense.service;

import com.example.expense.dto.AnomalyDto;
import com.example.expense.dto.SummaryDto;
import com.example.expense.entity.Expense;
import com.example.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll().stream()
                .sorted(Comparator.comparing(Expense::getExpenseDate).reversed())
                .toList();
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Expense not found: " + id));
        existing.setTitle(expense.getTitle());
        existing.setAmount(expense.getAmount());
        existing.setCategory(expense.getCategory());
        existing.setExpenseDate(expense.getExpenseDate());
        existing.setNotes(expense.getNotes());
        return expenseRepository.save(existing);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public List<SummaryDto> getWeeklySummary() {
        LocalDate today = LocalDate.now();
        LocalDate start = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate end = start.plusDays(6);
        List<Expense> expenses = expenseRepository.findByExpenseDateBetween(start, end);

        Map<DayOfWeek, Double> totals = new EnumMap<>(DayOfWeek.class);
        for (DayOfWeek day : DayOfWeek.values()) {
            totals.put(day, 0.0);
        }
        expenses.forEach(e -> totals.merge(e.getExpenseDate().getDayOfWeek(), e.getAmount(), Double::sum));

        List<DayOfWeek> order = List.of(DayOfWeek.SUNDAY, DayOfWeek.MONDAY, DayOfWeek.TUESDAY,
                DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY);

        return order.stream()
                .map(day -> new SummaryDto(day.name().substring(0, 3), round(totals.get(day))))
                .toList();
    }

    public List<SummaryDto> getMonthlySummary() {
        return expenseRepository.findAll().stream()
                .collect(Collectors.groupingBy(e -> e.getExpenseDate().getYear() + "-" + String.format("%02d", e.getExpenseDate().getMonthValue()),
                        TreeMap::new,
                        Collectors.summingDouble(Expense::getAmount)))
                .entrySet().stream()
                .map(e -> new SummaryDto(e.getKey(), round(e.getValue())))
                .toList();
    }

    public List<SummaryDto> getCategorySummary() {
        return expenseRepository.findAll().stream()
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getAmount)))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> new SummaryDto(e.getKey(), round(e.getValue())))
                .toList();
    }

    public List<AnomalyDto> detectSimpleAnomalies() {
        List<Expense> expenses = expenseRepository.findAll();
        if (expenses.isEmpty()) {
            return List.of();
        }
        double average = expenses.stream().mapToDouble(Expense::getAmount).average().orElse(0.0);
        double threshold = average * 2.0;
        return expenses.stream()
                .filter(e -> e.getAmount() >= threshold)
                .sorted(Comparator.comparing(Expense::getExpenseDate).reversed())
                .map(e -> new AnomalyDto(e.getId(), e.getTitle(), e.getAmount(), e.getCategory(), e.getExpenseDate(),
                        "This expense is significantly above your average spending."))
                .toList();
    }

    public List<Expense> getAllForMl() {
        return expenseRepository.findAll();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
