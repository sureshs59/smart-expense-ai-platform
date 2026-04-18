package com.example.expense.service;

import com.example.expense.dto.PredictionResponse;
import com.example.expense.entity.Expense;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiClientService {

    private final WebClient.Builder webClientBuilder;

    @Value("${ml.service.base-url}")
    private String mlServiceBaseUrl;

    public PredictionResponse predictNextMonth(List<Expense> expenses) {
        try {
            WebClient client = webClientBuilder.baseUrl(mlServiceBaseUrl).build();
            Map<String, Object> response = client.post()
                    .uri("/predict/next-month")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("expenses", expenses))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null || response.get("predictedExpense") == null) {
                return new PredictionResponse(0.0, "ML service returned no prediction.");
            }
            Double predicted = Double.valueOf(response.get("predictedExpense").toString());
            String message = response.getOrDefault("message", "Prediction generated successfully.").toString();
            return new PredictionResponse(predicted, message);
        } catch (Exception ex) {
            return new PredictionResponse(0.0, "ML service is not available. Start FastAPI on port 8000.");
        }
    }
}
