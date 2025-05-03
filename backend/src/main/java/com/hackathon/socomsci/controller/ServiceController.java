// ServiceController.java
package com.hackathon.socomsci.controller;

import com.hackathon.socomsci.model.OfferedService; // Import the specific model class
// Remove or adjust com.hackathon.socomsci.model.* if you don't need other models imported this way
import com.hackathon.socomsci.repository.ServiceRepository; // Correct import for the repository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ServiceController {

    private final ServiceRepository serviceRepository;

    @Autowired
    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping("/services/{serviceId}")
    public ResponseEntity<OfferedService> getServiceById(@PathVariable String serviceId) {
        return serviceRepository.findByServiceId(serviceId)
                // If a service is found, map it to an OK response entity with the service as
                // the body
                .map(service -> new ResponseEntity<>(service, HttpStatus.OK))
                // If no service is found, return a NOT_FOUND response entity with a null body
                // of type OfferedService
                .orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_FOUND)); // <-- Modified line
    }

    // You might add endpoints for getting all services, creating services, etc.
}