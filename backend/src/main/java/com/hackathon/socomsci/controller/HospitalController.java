
// HospitalController.java
package com.hackathon.socomsci.controller;

import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class HospitalController {

    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/hospitals")
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        List<Hospital> hospitals = hospitalService.getAllHospitals();
        // Services are Lazy loaded by default unless configured otherwise or fetched.
        // If you need services returned with hospitals in this endpoint, you might need
        // to change FetchType or use a DTO.
        // For now, frontend fetches services separately when a hospital is selected.
        return new ResponseEntity<>(hospitals, HttpStatus.OK);
    }

    @GetMapping("/hospitals/{hospitalId}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable String hospitalId) {
        return hospitalService.getHospitalByHospitalId(hospitalId)
                .map(hospital -> new ResponseEntity<>(hospital, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/hospitals/{hospitalId}/services")
    public ResponseEntity<Set<OfferedService>> getServicesByHospital(@PathVariable String hospitalId) {
        try {
            Set<OfferedService> services = hospitalService.getServicesByHospitalId(hospitalId);
            // Services relationship is eagerly loaded by default here due to the explicit
            // fetch,
            // but @JsonIgnore is on Hospital side to prevent recursion. Returning a
            // Set<Service> should be fine.
            return new ResponseEntity<>(services, HttpStatus.OK);
        } catch (RuntimeException e) { // e.g., Hospital not found
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // You might add endpoints for creating hospitals, etc.
}