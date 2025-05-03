
// BookingController.java
package com.hackathon.socomsci.controller;

import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/hospitals/{hospitalId}/services/{serviceId}/bookings")
    public ResponseEntity<Booking> createBooking(
            @PathVariable String hospitalId,
            @PathVariable String serviceId,
            @RequestBody Booking booking) {
        try {
            // The service will find the Hospital and Service entities and set them on the
            // booking and call AI for urgency classification
            Booking createdBooking = bookingService.addBooking(hospitalId, serviceId, booking);
            return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
        } catch (RuntimeException e) { // Catch exceptions from service if hospital/service not found or AI issue
            e.printStackTrace(); // Log the error
            // Consider more specific error responses based on the exception type
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST); // 400 for invalid request (e.g., not found IDs)
        } catch (Exception e) {
            e.printStackTrace(); // Log unexpected errors
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // Return 500 for other errors
        }
    }

    @GetMapping("/queue/{hospitalId}/{serviceId}")
    public ResponseEntity<List<Booking>> getQueue(
            @PathVariable String hospitalId,
            @PathVariable String serviceId) {
        try {
            // The service fetches and sorts the queue
            List<Booking> queue = bookingService.getQueue(hospitalId, serviceId);
            // Note: By default, JPA might lazy-load the Hospital and Service entities in
            // the Booking list. Your frontend expects nested hospital/service objects
            // (based on QueuePage.js).
            // Ensure your JPA configuration allows this or configure FetchType.EAGER (with
            // caution)
            // or use a DTO in the service/controller to fetch necessary fields explicitly.
            // Returning the Booking entity directly with default fetch behavior might work
            // if
            // Spring/Jackson initializes the proxies during serialization. Test this.
            return new ResponseEntity<>(queue, HttpStatus.OK);
        } catch (RuntimeException e) { // Catch exceptions from service if hospital/service not found
            e.printStackTrace(); // Log the error
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND); // Return 404 if hospital/service not found
        } catch (Exception e) {
            e.printStackTrace(); // Log unexpected errors
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR); // Return 500 for other errors
        }
    }
}