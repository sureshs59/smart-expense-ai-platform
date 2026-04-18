package com.example.expense.dto;

import java.time.LocalDate;

public record AnomalyDto(Long id, String title, Double amount, String category, LocalDate expenseDate, String message) {}
