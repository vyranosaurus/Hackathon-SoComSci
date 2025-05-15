package com.hackathon.socomsci.controller;

import com.hackathon.socomsci.dto.HospitalDTO;
import com.hackathon.socomsci.dto.OfferedServiceDTO;
import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://weaid-production.up.railway.app")
public class HospitalController {

    private static final Logger logger = LoggerFactory.getLogger(HospitalController.class);

    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/hospitals")
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        try {
            List<Hospital> hospitals = hospitalService.getAllHospitals();
            
            logger.debug("Found {} hospitals in the database", hospitals.size());
            if (hospitals.isEmpty()) {
                logger.warn("No hospitals found in the database!");
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            List<HospitalDTO> hospitalDTOs = hospitals.stream()
                    .map(HospitalDTO::new)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(hospitalDTOs, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error retrieving hospitals", e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/hospitals/{hospitalId}")
    public ResponseEntity<HospitalDTO> getHospitalById(@PathVariable String hospitalId) {
        logger.debug("Attempting to find hospital with ID: {}", hospitalId);
        
        return hospitalService.getHospitalByHospitalId(hospitalId)
                .map(hospital -> {
                    logger.debug("Found hospital with ID: {}", hospitalId);
                    return new ResponseEntity<>(new HospitalDTO(hospital), HttpStatus.OK);
                })
                .orElseGet(() -> {
                    logger.error("Hospital not found with ID: {}", hospitalId);
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                });
    }

    @GetMapping("/hospitals/{hospitalId}/services")
    public ResponseEntity<List<OfferedServiceDTO>> getServicesByHospital(@PathVariable String hospitalId) {
        logger.debug("Attempting to find services for hospital with ID: {}", hospitalId);
        
        try {
            Set<OfferedService> services = hospitalService.getServicesByHospitalId(hospitalId);
            logger.debug("Found {} services for hospital {}", services.size(), hospitalId);
            
            List<OfferedServiceDTO> serviceDTOs = services.stream()
                    .map(OfferedServiceDTO::new)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(serviceDTOs, HttpStatus.OK);
        } catch (RuntimeException e) {
            logger.error("Hospital not found with ID: {}", hospitalId, e);
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            logger.error("Error retrieving services for hospital ID: {}", hospitalId, e);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}