
// BookingController.java
package com.hackathon.socomsci.controller;

import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import com.hackathon.socomsci.dto.BookingDTO;
import java.util.stream.Collectors;

import java.util.List;
import com.hackathon.socomsci.dto.BookingRequestDTO;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://weaid-production.up.railway.app")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping(
    value = "/hospitals/{hospitalId}/services/{serviceId}/bookings", 
    consumes = "application/json", 
    produces = "application/json"
    )
    public ResponseEntity<BookingDTO> createBooking(
            @PathVariable String hospitalId,
            @PathVariable String serviceId,
            @RequestBody BookingRequestDTO bookingRequest) {
        try {
            // Manually map BookingRequestDTO to Booking entity
            Booking booking = new Booking();
            booking.setName(bookingRequest.getName());
            booking.setAge(bookingRequest.getAge());
            booking.setPhoneNumber(bookingRequest.getPhoneNumber());
            booking.setConcern(bookingRequest.getConcern());
            booking.setHasMedicalCard(bookingRequest.getHasMedicalCard());
            booking.setMedicalCardCompany(bookingRequest.getMedicalCardCompany());
            booking.setMedicalCardNumber(bookingRequest.getMedicalCardNumber());
            booking.setMedicalCardName(bookingRequest.getMedicalCardName());
            // Let the service handle hospital/service association and AI logic
            Booking createdBooking = bookingService.addBooking(hospitalId, serviceId, booking);
            BookingDTO bookingDTO = new BookingDTO(createdBooking);
            return new ResponseEntity<>(bookingDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace(); // Log unexpected errors
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // Return 500 for other errors
        }
    }

    @GetMapping("/queue/{hospitalId}/{serviceId}")
    public ResponseEntity<List<BookingDTO>> getQueue(
            @PathVariable String hospitalId,
            @PathVariable String serviceId) {
        try {
            // The service fetches and sorts the queue
            List<Booking> queue = bookingService.getQueue(hospitalId, serviceId);
            List<BookingDTO> queueDTOs = queue.stream()
                .map(BookingDTO::new)
                .collect(Collectors.toList());
            return new ResponseEntity<>(queueDTOs, HttpStatus.OK);
        } catch (RuntimeException e) { // Catch exceptions from service if hospital/service not found
            e.printStackTrace(); // Log the error
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // Return 404 if hospital/service not found
        } catch (Exception e) {
            e.printStackTrace(); // Log unexpected errors
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // Return 500 for other errors
        }
    }
}