package com.example.expense.config;

import com.example.expense.entity.Expense;
import com.example.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    @Bean
    CommandLineRunner seedExpenses(ExpenseRepository repository) {
        return args -> {
            if (repository.count() > 0) {
                return;
            }
            repository.saveAll(List.of(
                    new Expense(null, "Groceries", 45.25, "Groceries", LocalDate.now().minusDays(1), "Weekly store run"),
                    new Expense(null, "Fuel", 60.00, "Transport", LocalDate.now().minusDays(2), "Gas refill"),
                    new Expense(null, "Rent", 1200.00, "Housing", LocalDate.now().minusDays(12), "Monthly rent"),
                    new Expense(null, "Dining", 32.50, "Food", LocalDate.now().minusDays(6), "Dinner outside"),
                    new Expense(null, "Internet", 75.00, "Utilities", LocalDate.now().minusDays(18), "Monthly bill"),
                    new Expense(null, "Coffee", 8.50, "Food", LocalDate.now().minusDays(4), "Cafe"),
                    new Expense(null, "Pharmacy", 24.00, "Health", LocalDate.now().minusDays(8), "Medicines"),
                    new Expense(null, "Shopping", 140.00, "Shopping", LocalDate.now().minusDays(16), "Clothes")
            ));
        };
    }
}
