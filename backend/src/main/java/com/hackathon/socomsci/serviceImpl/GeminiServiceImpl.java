
package com.hackathon.socomsci.serviceImpl;

import com.hackathon.socomsci.service.GeminiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;
    @Value("${gemini.api.url}")
    private String apiUrl;

    private WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();

    @PostConstruct
    public void init() {
        if (apiUrl == null || apiUrl.isEmpty() || apiKey == null || apiKey.isEmpty()) {
            System.err.println("Gemini API URL or Key is not configured. GeminiService will use stub logic.");
            this.webClient = null;
        } else {
            this.webClient = WebClient.builder()
                    .baseUrl(apiUrl)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();
            System.out.println("GeminiService configured with API URL: " + apiUrl);
        }
    }

    @Override
    public Map<String, Object> classifyAndScoreUrgency(String concern) {
        Map<String, Object> classificationResult = new HashMap<>();
        String extractedUrgency = "Not specified";
        Integer extractedScore = null;

        if (webClient != null) {
            try {
                String prompt = """
                        You are a medical triage assistant classifying patient concerns for appointment scheduling urgency.
                        Analyze the following patient concern and classify its urgency into one of these categories:
                        'Critical', 'Urgent', 'Not urgent', 'Not specified'.

                        'Critical': Requires immediate, life-saving intervention (e.g., severe uncontrolled bleeding, signs of stroke/heart attack, difficulty breathing, sudden loss of consciousness).
                        'Urgent': Requires prompt medical attention, but not immediately life-threatening (e.g., moderate bleeding that won't stop, severe pain not controlled by medication, sudden severe symptoms, suspected infection).
                        'Not urgent': Routine care, follow-up, mild or chronic symptoms (e.g., general check-up, medication refill, stable chronic condition concerns, mild rash).
                        'Not specified': Concern is too vague, lacks information to determine urgency, or is outside of typical medical urgency (e.g., "just checking in", administrative questions).

                        If the urgency is 'Urgent', also provide a numerical priority score between 1 and 10
                        (1 being least urgent within the 'Urgent' category, 10 being most urgent within 'Urgent').
                        Do not provide a score for 'Critical', 'Not urgent', or 'Not specified'.

                        Respond ONLY in a JSON format like this:
                        {
                          "urgency": "Classification Here",
                          "urgentPriorityScore": ScoreHere
                        }

                        Examples:
                        Patient Concern: "I have a runny nose."
                        {
                          "urgency": "Not urgent",
                          "urgentPriorityScore": null
                        }

                        Patient Concern: "Severe chest pain suddenly started."
                        {
                          "urgency": "Critical",
                          "urgentPriorityScore": null
                        }

                        Patient Concern: "I cut my hand and it's bleeding quite a bit, I can't get it to stop."
                        {
                          "urgency": "Urgent",
                          "urgentPriorityScore": 7
                        }

                        Patient Concern: "My chronic back pain is a little worse today."
                        {
                          "urgency": "Not urgent",
                          "urgentPriorityScore": null
                        }

                        Patient Concern: "I have cancer i need treatment options."
                         {
                          "urgency": "Urgent",
                          "urgentPriorityScore": null
                        }

                        Patient Concern: "I am bleeding heavily from a wound."
                        {
                          "urgency": "Critical",
                          "urgentPriorityScore": null
                        }

                        Patient Concern: "I have had a fever and cough for three days."
                        {
                          "urgency": "Urgent",
                          "urgentPriorityScore": 5
                        }

                        Patient Concern: %s
                        """
                        .formatted(concern);

                Map<String, Object> part = new HashMap<>();
                part.put("text", prompt);

                Map<String, Object> requestBody = Map.of(
                        "contents", List.of(Map.of("parts", List.of(part))),
                        "safetySettings", List.of(
                                Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_NONE"),
                                Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_NONE"),
                                Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_NONE"),
                                Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_NONE")),
                        "generationConfig", Map.of("temperature", 0.1, "responseMimeType", "application/json"));

                Mono<Map> responseMono = webClient.post()
                        .uri(uriBuilder -> uriBuilder.queryParam("key", apiKey).build())
                        .body(BodyInserters.fromValue(requestBody))
                        .retrieve()
                        .bodyToMono(Map.class);

                Map geminiResponse = responseMono.block();

                if (geminiResponse != null && geminiResponse.containsKey("candidates")) {
                    List<Map<String, Object>> candidates = (List<Map<String, Object>>) geminiResponse.get("candidates");
                    if (!candidates.isEmpty()) {
                        Map<String, Object> firstCandidate = candidates.get(0);
                        if (firstCandidate.containsKey("content")) {
                            Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                            if (content.containsKey("parts")) {
                                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                                if (!parts.isEmpty()) {
                                    String text = (String) parts.get(0).get("text");
                                    text = text.replace("```json", "").replace("```", "").trim();

                                    try {
                                        Map<String, Object> parsedJson = objectMapper.readValue(text, Map.class);
                                        if (parsedJson.containsKey("urgency")) {
                                            extractedUrgency = (String) parsedJson.get("urgency");
                                        }
                                        if (parsedJson.containsKey("urgentPriorityScore")) {
                                            Object scoreObj = parsedJson.get("urgentPriorityScore");
                                            if (scoreObj instanceof Number) {
                                                extractedScore = ((Number) scoreObj).intValue();
                                            }
                                        }
                                        System.out.println("API Classification Success for Concern '" + concern + "': "
                                                + extractedUrgency
                                                + (extractedScore != null ? " (Score: " + extractedScore + ")" : ""));
                                    } catch (JsonProcessingException jsonParseError) {
                                        System.err.println("Could not parse AI response as JSON: '" + text
                                                + "'. Error: " + jsonParseError.getMessage());
                                        extractedUrgency = "Not specified";
                                        extractedScore = null;
                                    }
                                }
                            }
                        }
                    }
                }

                if (geminiResponse != null && geminiResponse.containsKey("promptFeedback")) {
                    Map<String, Object> feedback = (Map<String, Object>) geminiResponse.get("promptFeedback");
                    if (feedback.containsKey("blockReason")) {
                        String blockReason = (String) feedback.get("blockReason");
                        System.err.println("AI response was blocked due to: " + blockReason);
                        extractedUrgency = "Not specified";
                        extractedScore = null;
                    }
                }
            } catch (WebClientResponseException apiError) {
                System.err.println("Gemini API responded with error status " + apiError.getStatusCode() + ": "
                        + apiError.getResponseBodyAsString());
                apiError.printStackTrace();
                extractedUrgency = "Not specified";
                extractedScore = null;
            } catch (Exception e) {
                System.err.println("Error calling or processing Gemini API: " + e.getMessage());
                e.printStackTrace();
                extractedUrgency = "Not specified";
                extractedScore = null;
            }
        }

        if ("Not specified".equals(extractedUrgency)) {
            if (concern.toLowerCase().contains("dying") || concern.toLowerCase().contains("critical")
                    || concern.toLowerCase().contains("severe pain") || concern.toLowerCase().contains("emergency")
                    || concern.toLowerCase().contains("life-threatening")) {
                extractedUrgency = "Critical";
                extractedScore = null;
            } else if (concern.toLowerCase().contains("urgent")
                    || concern.toLowerCase().contains("needs immediate attention")
                    || concern.toLowerCase().contains("cannot wait quickly")
                    || concern.toLowerCase().contains("severe symptoms")) {
                extractedUrgency = "Urgent";
                extractedScore = random.nextInt(10) + 1;
            } else if (concern.toLowerCase().contains("routine check") || concern.toLowerCase().contains("follow up")
                    || concern.toLowerCase().contains("mild symptoms")
                    || concern.toLowerCase().contains("general consultation")) {
                extractedUrgency = "Not urgent";
                extractedScore = null;
            } else {
                extractedUrgency = "Not specified";
                extractedScore = null;
            }
            System.out.println("Using STUB/FALLBACK Classification for Concern '" + concern + "': " + extractedUrgency
                    + (extractedScore != null ? " (Score: " + extractedScore + ")" : ""));
        } else {
            if (!"Urgent".equals(extractedUrgency)) {
                extractedScore = null;
            }
            if ("Urgent".equals(extractedUrgency)
                    && (extractedScore == null || extractedScore < 1 || extractedScore > 10)) {
                System.err.println("Invalid urgent priority score: " + extractedScore + ". Using random score.");
                extractedScore = random.nextInt(10) + 1;
            }
        }

        classificationResult.put("urgency", extractedUrgency);
        classificationResult.put("urgentPriorityScore", extractedScore);
        return classificationResult;
    }
}