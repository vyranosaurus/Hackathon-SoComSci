package com.hackathon.socomsci.service;

import com.hackathon.socomsci.model.*;
import com.hackathon.socomsci.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class HospitalService {

    private static final Logger logger = LoggerFactory.getLogger(HospitalService.class);

    private final HospitalRepository hospitalRepository;

    private final ServiceRepository serviceRepository;

    @Autowired
    public HospitalService(HospitalRepository hospitalRepository, ServiceRepository serviceRepository) {
        this.hospitalRepository = hospitalRepository;
        this.serviceRepository = serviceRepository;
    }

    public List<Hospital> getAllHospitals() {
        logger.debug("Fetching all hospitals from database");
        List<Hospital> hospitals = hospitalRepository.findAll();
        logger.debug("Found {} hospitals in database", hospitals.size());
        return hospitals;
    }

    public Optional<Hospital> getHospitalByHospitalId(String hospitalId) {
        logger.debug("Looking up hospital with ID: {}", hospitalId);
        Optional<Hospital> hospital = hospitalRepository.findByHospitalId(hospitalId);
        
        if (hospital.isPresent()) {
            logger.debug("Found hospital: {}", hospital.get().getName());
        } else {
            logger.warn("No hospital found with ID: {}", hospitalId);
        }
        
        return hospital;
    }

    @Transactional(readOnly = true)
    public Set<com.hackathon.socomsci.model.OfferedService> getServicesByHospitalId(String hospitalId) {
        logger.debug("Looking up services for hospital with ID: {}", hospitalId);
        
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> {
                    logger.error("Hospital not found with ID: {}", hospitalId);
                    return new RuntimeException("Hospital not found with ID: " + hospitalId);
                });

        logger.debug("Found hospital: {}, retrieving its {} services", 
                hospital.getName(), hospital.getServices().size());
        
        return hospital.getServices();
    }

    public Hospital createHospital(Hospital hospital) {
        logger.debug("Creating new hospital: {}", hospital.getName());
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(String hospitalId, Hospital hospitalDetails) {
        logger.debug("Updating hospital with ID: {}", hospitalId);
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> {
                    logger.error("Hospital not found with ID: {}", hospitalId);
                    return new RuntimeException("Hospital not found with ID: " + hospitalId);
                });

        hospital.setName(hospitalDetails.getName());
        hospital.setLocation(hospitalDetails.getLocation());
        hospital.setImageUrl(hospitalDetails.getImageUrl());

        hospital.setFree(hospitalDetails.isFree());

        logger.debug("Updated hospital: {}", hospital.getName());
        return hospitalRepository.save(hospital);
    }

    public Hospital toggleFreeStatus(String hospitalId) {
        logger.debug("Toggling free status for hospital with ID: {}", hospitalId);
        Hospital hospital = hospitalRepository.findByHospitalId(hospitalId)
                .orElseThrow(() -> {
                    logger.error("Hospital not found with ID: {}", hospitalId);
                    return new RuntimeException("Hospital not found with ID: " + hospitalId);
                });

        hospital.setFree(!hospital.isFree());

        logger.debug("Updated hospital free status: {}", hospital.isFree());
        return hospitalRepository.save(hospital);
    }
}
