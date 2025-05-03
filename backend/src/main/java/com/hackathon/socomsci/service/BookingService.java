package com.hackathon.socomsci.service;

// import com.hackathon.socomsci.model.*; // Remove or change this import
import com.hackathon.socomsci.model.OfferedService; // Import the renamed model class
import com.hackathon.socomsci.model.Booking;
import com.hackathon.socomsci.model.Hospital;
import com.hackathon.socomsci.repository.*; // Imports ServiceRepository, HospitalRepository, BookingRepository etc.
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // Import the @Service annotation
import jakarta.transaction.Transactional; // Import the Transactional annotation

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service // This is the Spring @Service annotation
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HospitalRepository hospitalRepository;
    // Correctly reference the repository type, not the model class
    private final ServiceRepository serviceRepository; // ServiceRepository is correct here
    private final GeminiService geminiService;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
            HospitalRepository hospitalRepository,
            // Use the repository type here: ServiceRepository
            ServiceRepository serviceRepository, // ServiceRepository is correct here
            GeminiService geminiService) {
        this.bookingRepository = bookingRepository;
        this.hospitalRepository = hospitalRepository;
        this.serviceRepository = serviceRepository;
        this.geminiService = geminiService;
    }

    @Transactional // Ensure this annotation is correctly imported and applied
    public Booking addBooking(String hospitalId, String serviceId, Booking newBookingData) {
        // 1. Find the Hospital and Service entities
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));
        // Use the correct repository method to find the Service entity
        // This method returns Optional<com.hackathon.socomsci.model.OfferedService>
        OfferedService service = serviceRepository.findByServiceId(serviceId) // <-- Change Service to OfferedService
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));
        // Set the found entities on the new booking data
        newBookingData.setHospital(hospital);
        newBookingData.setService(service); // 'service' here is com.hackathon.socomsci.model.OfferedService
        // Assuming Booking model's setService method accepts OfferedService

        // 2. Call AI to classify urgency and get potential score
        Map<String, Object> classificationResult = geminiService.classifyAndScoreUrgency(newBookingData.getConcern());
        String urgency = (String) classificationResult.get("urgency");
        Integer urgentPriorityScore = (Integer) classificationResult.get("urgentPriorityScore");
        // 3. Set the AI-determined urgency and score on the booking
        newBookingData.setUrgency(urgency != null && !urgency.isEmpty() ? urgency : "Not specified");
        newBookingData.setUrgentPriorityScore(urgentPriorityScore);

        // 4. Save the booking to the database
        return bookingRepository.save(newBookingData);
    }

    public List<Booking> getQueue(String hospitalId, String serviceId) {
        // 1. Find the Hospital and Service entities
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));
        // Use the correct repository method to find the Service entity
        // This method returns Optional<com.hackathon.socomsci.model.OfferedService>
        OfferedService service = serviceRepository.findByServiceId(serviceId) // <-- Change Service to OfferedService
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));
        // 2. Fetch all relevant bookings using the entities
        List<Booking> bookings = bookingRepository.findByHospitalAndService(hospital, service); // 'service' here is
                                                                                                // com.hackathon.socomsci.model.OfferedService
        // 3. Apply the complex sorting logic: Critical > Urgent (by score desc, then
        // FCFS) > Not urgent (FCFS) > Not specified (FCFS)
        bookings.sort(Comparator
                .comparing(Booking::getUrgency, Comparator.comparingInt(this::getUrgencyOrder)) // Primary sort by
                                                                                                // urgency level
                .thenComparing(booking -> { // Secondary sort: Urgent cases by score (descending)
                    if ("Urgent".equals(booking.getUrgency())) {
                        // Handle null scores for safety, treat null as lowest priority within Urgent
                        // (or assign a default low score)
                        return booking.getUrgentPriorityScore() != null ? -booking.getUrgentPriorityScore()
                                : Integer.MIN_VALUE;
                    }
                    return 0; // Not applicable for other urgency types - they sort based on timestamp next
                })
                .thenComparing(Booking::getTimestamp) // Tertiary sort: FCFS within the same urgency/score level
        );

        return bookings;
    }

    /**
     * Helper method to define the sorting order of urgency levels.
     * Lower number means higher priority.
     */
    private int getUrgencyOrder(String urgency) {
        return switch (urgency) {
            case "Critical" -> 1;
            case "Urgent" -> 2;
            case "Not urgent" -> 3;
            case "Not specified" -> 4;
            default -> 5; // Should not happen with defined types
        };
    }
}