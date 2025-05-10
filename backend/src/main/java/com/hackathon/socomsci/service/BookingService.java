package com.hackathon.socomsci.service;

import com.hackathon.socomsci.model.OfferedService;
import com.hackathon.socomsci.model.Booking;
import com.hackathon.socomsci.model.Hospital;
import com.hackathon.socomsci.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final HospitalRepository hospitalRepository;

    private final ServiceRepository serviceRepository;
    private final GeminiService geminiService;

    @Autowired
    public BookingService(BookingRepository bookingRepository,
            HospitalRepository hospitalRepository,

            ServiceRepository serviceRepository,
            GeminiService geminiService) {
        this.bookingRepository = bookingRepository;
        this.hospitalRepository = hospitalRepository;
        this.serviceRepository = serviceRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public Booking addBooking(String hospitalId, String serviceId, Booking newBookingData) {

        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));

        OfferedService service = serviceRepository.findByServiceId(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));

        newBookingData.setHospital(hospital);
        newBookingData.setService(service);

        Map<String, Object> classificationResult = geminiService.classifyAndScoreUrgency(newBookingData.getConcern());
        String urgency = (String) classificationResult.get("urgency");
        Integer urgentPriorityScore = (Integer) classificationResult.get("urgentPriorityScore");

        newBookingData.setUrgency(urgency != null && !urgency.isEmpty() ? urgency : "Not specified");
        newBookingData.setUrgentPriorityScore(urgentPriorityScore);

        return bookingRepository.save(newBookingData);
    }

    public List<Booking> getQueue(String hospitalId, String serviceId) {

        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found with ID: " + hospitalId));

        OfferedService service = serviceRepository.findByServiceId(serviceId)
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + serviceId));

        List<Booking> bookings = bookingRepository.findByHospitalAndService(hospital, service);

        bookings.sort(Comparator
                .comparing(Booking::getUrgency, Comparator.comparingInt(this::getUrgencyOrder))

                .thenComparing(booking -> {
                    if ("Urgent".equals(booking.getUrgency())) {

                        return booking.getUrgentPriorityScore() != null ? -booking.getUrgentPriorityScore()
                                : Integer.MIN_VALUE;
                    }
                    return 0;
                })
                .thenComparing(Booking::getTimestamp));

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
            default -> 5;
        };
    }
}