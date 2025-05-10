
package com.hackathon.socomsci.controller;

import com.hackathon.socomsci.model.OfferedService;

import com.hackathon.socomsci.repository.ServiceRepository;
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

                .map(service -> new ResponseEntity<>(service, HttpStatus.OK))

                .orElseGet(() -> new ResponseEntity<>(null, HttpStatus.NOT_FOUND));
    }

}